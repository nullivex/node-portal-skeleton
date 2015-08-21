'use strict';
var P = require('bluebird')

var config = require('../../config')
var sequelize = require('../../helpers/sequelize')()

var Category = sequelize.models.Category
var Item = sequelize.models.Item


/**
 * Homepage
 * @param {object} req
 * @param {object} res
 */
exports.index = function(req,res){
  P.all([
    //Item List
    Item.findAndCountAll({
      where:{active:true},
      order: [['sortLetter','DESC']]
    }),
    //featured items
    Item.findAndCountAll({
      where: {featured: true, active: true},
      limit: 10,
      order: [['hits','DESC']]
    }),
    //recently listed items
    Item.findAndCountAll({
      where: {active: true},
      limit: 12,
      order: [['createdAt','DESC']]
    }),
    sequelize.query(
      'SELECT c.* FROM `Categories` AS c WHERE ' +
        '(SELECT COUNT(*) FROM `ItemCategories` AS ic ' +
        'WHERE ic.CategoryId = c.id) > ' + config.main.homeCategoryWeight + ' ' +
      'ORDER BY c.name ASC ' +
      'LIMIT 50',
      Category
    )
  ])
    .spread(
      function(
        itemList,
        featuredItems,
        recentItems,
        categoryList
        )
      {
        res.render('index',{
          itemList: itemList.rows,
          featuredItems: featuredItems.rows,
          recentItems: recentItems.rows,
          categoryList: categoryList
        })
      }
    )
    .catch(function(err){
      res.render('error',{error: err})
    })
}


/**
 * Surprise Me
 * @param {object} req
 * @param {object} res
 */
exports.random = function(req,res){
  //dont cache this page
  res.set('Cache-Control','private, no-cache, no-store, must-revalidate')
  res.set('Expires','-1')
  res.set('Pragma','no-cache')
  //make the query
  sequelize.query(
    'SELECT i.id FROM Items AS i' +
    ' WHERE' +
      ' i.active = 1 ' +
    ' ORDER BY RAND()' +
    ' LIMIT 1'
  )
    .then(function(result){
      res.redirect('/item/detail/?id=' + result[0][0].id)
    })
    .catch(function(err){
      console.log('Failed to randomly select an item: ' + err)
      res.redirect('/')
    })
}


/**
 * Contact Us Emails
 * @type {exports}
 */
exports.contact = require('./contact')


/**
 * Create User
 * @type {exports}
 */
exports.user = require('./user')


/**
 * Buyer
 * @type {exports}
 */
exports.buyer = require('./buyer')


/**
 * Item
 * @type {exports}
 */
exports.item = require('./item')

/**
 * Search
 * @type {exports}
 */
exports.search = require('./search')


/**
 * RSS feed
 * @type {exports}
 */
exports.rss = require('./rss')


/**
 * Blog
 * @type {exports}
 */
exports.blog = require('./blog')


/**
 * Sitemap
 * @type {exports}
 */
exports.sitemap = require('./sitemap')
