'use strict';
var oose = require('oose-sdk')
var P = require('bluebird')

var list = require('../../helpers/list')
var config = require('../../config')
var sequelize = require('../../helpers/sequelize')()

var Seller = sequelize.models.Seller
var Item = sequelize.models.Item
var Category = sequelize.models.Category

var UserError = oose.UserError


/**
 * Item Detail
 * @param {object} req
 * @param {object} res
 */
exports.detail = function(req,res){
  var item
  P.all([
    Item.find({
      where: {id: req.query.id},
      include: [Seller]
    })
      .then(function(result){
        item = result
        return item.increment({hits:1})
      }),
    Item.findAndCountAll({
      where: {featured: true, active: true},
      limit: 8,
      order: [['hits','DESC']]
    })
  ])
    .spread(
      function(
        item,
        featuredItems)
      {
        res.render('item/detail',{
          item: item,
          featuredItems: featuredItems.rows
        })
      }
    )
    .catch(function(err){
      console.log(err)
      res.render('error',{error: err})
    })
}


/**
 * List Items
 * @param {object} req
 * @param {object} res
 */
exports.index = function(req,res){
  var limit = parseInt(req.query.limit,10) || 10
  var start = parseInt(req.query.start,10) || 0
  var search = req.query.search || ''
  if(start < 0) start = 0
  Item.findAndCountAll({
    where: sequelize.or(
      {title: {like: '%' + search + '%'}},
      {keywords: {like: '%' + search + '%'}}
    ),
    offset: start,
    limit: limit,
    order: ['sortLetter','title']
  })
    .then(function(result){
      res.render('item/list',{
        page: list.pagination(start,result.count,limit),
        count: result.count,
        search: search,
        limit: limit,
        list: result.rows
      })
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}


/**
 * Genres Bitches
 * @param {object} req
 * @param {object} res
 */
exports.category = function(req,res){
  var start = (+req.query.start) || 0
  var currentCategory = req.params.category
  var itemCount
  var page
  P.try(function(){
    if(!currentCategory)
      throw new UserError('Category is required')
    return sequelize.query(
      'SELECT COUNT(ic.ItemId) AS itemCount FROM ItemCategories AS ic ' +
      ' WHERE ic.CategoryId = (SELECT c.id FROM Categories AS c WHERE c.name = :category)',
      {replacements: {category: currentCategory}}
    )
  })
    .then(function(result){
      itemCount = +result[0][0].itemCount
      page = list.pagination(start,itemCount,12)
      return P.all([
        sequelize.query(
          'SELECT i.* FROM Items AS i ' +
          'WHERE i.id IN(' +
            '(SELECT ic.ItemId FROM ItemCategories AS ic ' +
            'WHERE ic.CategoryId = ' +
              '(SELECT c.id FROM Categories AS c WHERE c.name = :category)))' +
          'ORDER BY i.hits DESC ' +
          'LIMIT ' + page.start + ',' + page.limit,
          Item,
          {replacements: {category: currentCategory}}
        ),
        sequelize.query(
          'SELECT c.* FROM `Categories` AS c WHERE ' +
            '(SELECT COUNT(*) FROM `ItemCategories` AS ic ' +
            'WHERE ic.CategoryId = c.id) > ' + config.main.homeCategoryWeight + ' ' +
          'ORDER BY c.name ASC ' +
          'LIMIT 50',
          Category
        )
      ])
    })
    .spread(function(itemList,categoryList){
      res.render('category',{
        itemList: itemList,
        page: page,
        itemCount: itemCount,
        categoryList: categoryList,
        currentCategory: req.params.category
      })
    })
    .catch(UserError,function(err){
      res.render('error',{error: err})
    })
}