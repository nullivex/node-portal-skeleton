'use strict';
var list = require('../../helpers/list')
var sequelize = require('../../helpers/sequelize')()

var Page = sequelize.models.Page


/**
 * List pages
 * @param {object} req
 * @param {object} res
 */
exports.list = function(req,res){
  var limit = +req.query.limit || 20
  var start = +req.query.start || 0
  var search = req.query.search || ''
  if(start < 0) start = 0
  Page.findAndCountAll({
    where: sequelize.or(
      {title: {like: '%' + search + '%'}}
    ),
    offset: start,
    limit: limit,
    order: ['title']
  })
    .then(function(result){
      res.render('page/list',{
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
 * Process list actions
 * @param {object} req
 * @param {object} res
 */
exports.listAction = function(req,res){
  list.remove(Page,req.body.remove)
    .then(function(){
      req.flash('success','Page(s) removed successfully')
      res.redirect('/page/list')
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}


/**
 * Create a new page
 * @param {object} req
 * @param {object} res
 */
exports.create = function(req,res){
  res.render('page/create')
}


/**
 * Page edit
 * @param {object} req
 * @param {object} res
 */
exports.edit = function(req,res){
  Page.find(req.query.id)
    .then(function(page){
      if(!page) throw new Error('Page not found')
      res.render('page/edit',{page: page})
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}


/**
 * Save page
 * @param {object} req
 * @param {object} res
 */
exports.save = function(req,res){
  var data = req.body
  Page.find(data.id)
    .then(function(page){
      if(!page) page = Page.build()
      if(data.title) page.title = data.title
      if(data.uri) page.uri = data.uri
      if(data.content) page.content = data.content
      if('undefined' === typeof data.active) page.active = false
      if(data.active) page.active = true
      return page.save()
    })
    .then(function(page){
      req.flash('success','Page entry saved')
      res.redirect('/page/edit?id=' + page.id)
    })
    .catch(function(err){
      console.trace(err)
      res.render('error',{error: err})
    })
}
