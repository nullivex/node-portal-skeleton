'use strict';
var P = require('bluebird')
var moment = require('moment')
var validator = require('validator')

var list = require('../../helpers/list')
var prism = require('../../helpers/prism')
var sequelize = require('../../helpers/sequelize')()
var sortLetterChange = require('../../helpers/sortLetter')

var Item = sequelize.models.Item
var Seller = sequelize.models.Seller
var Category = sequelize.models.Category

/**
 * List item
 * @param {object} req
 * @param {object} res
 */
exports.list = function(req,res){
  var seller
  var limit = parseInt(req.query.limit,10) || 10
  var start = parseInt(req.query.start,10) || 0
  var search = req.query.search || ''
  if(start < 0) start = 0
  Seller.find({where: {id: req.session.seller.id}})
    .then(function(result){
      if(!result) throw new Error('Seller not found')
      seller = result
      return Item.findAndCountAll({where: {SellerId: seller.id}, order: [['createdAt','DESC']]})
    })
    .then(function(result){
      res.render('items/list',{
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
 * List actions
 * @param {object} req
 * @param {object} res
 */
exports.listAction = function(req,res){
  list.remove(Item,req.body.remove)
    .then(function(){
      req.flash('success','Item(s) removed successfully')
      res.redirect('/items/list')
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}


/**
 * Create item
 * @param {object} req
 * @param {object} res
 */
exports.create = function(req,res){
  res.render('items/create')
}


/**
 * Edit item
 * @param {object} req
 * @param {object} res
 */
exports.edit = function(req,res){
  var item
  Item.find({where: {id: req.query.id}, include: [Category]})
    .then(function(result){
      if(!result) throw new Error('Item not found')
      item = result
      return item
    })
    .then(function(){
      item.categories = []
      for(var i = 0; i<item.Categories.length; i++)
        item.categories.push(item.Categories[i].name)
      res.render('items/edit',{
        item: item
      })
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}


/**
 * Save item
 * @param {object} req
 * @param {object} res
 */
exports.save = function(req,res){
  var data = req.body
  Item.find(data.id)
    .then(function(item){
      if(!item) item = Item.build()
      if(data.title) item.title = data.title
      if(data.price) item.price = data.price
      if(data.uri) item.uri = data.uri
      if(data.sortLetter) item.sortLetter = data.sortLetter
      if(data.keywords) item.keywords = data.keywords
      if(data.listDate) item.listDate = moment.utc(data.listDate,'MM-DD-YYYY')
      if(data.description) item.description = data.description
      item.SellerId = req.session.seller.id
      item.new = !!data.new
      item.featured = !!data.featured
      item.active = !!data.active
      if(!item.uri) item.uri = item.title
      if(!item.sortLetter) item.sortLetter = sortLetterChange.format(item.title.charAt(0).toLowerCase())
      return P.all([
        item.save(),
        item.saveCategories(data.categories)
      ])
    })
    .then(function(results){
      req.flash('success','Item Saved')
      res.redirect('/items/edit?id=' + results[0].id)
    })
}


/**
 * Import thumbnail
 * @param {object} req
 * @param {object} res
 */
exports.importThumbnail = function(req,res){
  Item.find(req.query.id)
    .then(function(item){
      res.render('items/importThumbnail',{item: item})
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}


/**
 * Import thumbnail action
 * @param {object} req
 * @param {object} res
 */
exports.importThumbnailAction = function(req,res){
  var url = req.body.url
  var item
  Item.find(req.body.id)
    .then(function(result){
      if(!result) throw new Error('No item found')
      if(!validator.isURL(url))
        throw new Error('No url provided')
      item = result
      return prism.contentRetrieve({url: url})
    })
    .then(function(result){
      item.thumbnailUrl = prism.urlStatic(
        result.sha1,
        result.extension,
        'thumbnail'
      )
      return item.save()
    })
    .then(function(){
      req.flash('success','Image successfully imported!')
      res.redirect('/items/edit?id=' + item.id)
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}