'use strict';
var list = require('../../helpers/list')
var sequelize = require('../../helpers/sequelize')()

var Client = sequelize.models.Client

/**
 * List Sellers
 * @param {object} req
 * @param {object} res
 */
exports.list = function(req,res){
  var limit = +req.query.limit || 10
  var start = +req.query.start || 0
  var search = req.query.search || ''
  if(start < 0) start = 0
  Client.findAndCountAll({
    where: sequelize.or(
      {email: {like: '%' + search + '%'}},
      {name: {like: '%' + search + '%'}}
    ),
    limit: limit,
    offset: start
  })
    .then(function(result){
      res.render('seller/list',{
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
 * List action
 * @param {object} req
 * @param {object} res
 */
exports.listAction = function(req,res){
  list.remove(Client,req.body.remove)
    .then(function(){
      req.flash('success','Seller removed successfully')
      res.redirect('/seller/list')
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}


/**
 * Create Seller
 * @param {object} req
 * @param {object} res
 */
exports.create = function(req,res){
  res.render('seller/create')
}


/**
 * Seller detail form
 * @param {object} req
 * @param {object} res
 */
exports.detail = function(req,res){
  Client.find({
    where: {id: req.query.id},
    include: [Item,SellerLedger,Order]
  })
    .then(function(result){
      if(!result) throw new Error('Seller not found')
      res.render('seller/detail',{seller: result})
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}


/**
 * Seller edit form
 * @param {object} req
 * @param {object} res
 */
exports.edit = function(req,res){
  Client.find(req.query.id)
    .then(function(result){
      if(!result) throw new Error('Seller not found')
      res.render('seller/edit',{seller: result})
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}

/**
 * Save Seller
 * @param {object} req
 * @param {object} res
 */
exports.save = function(req,res){
  var data = req.body
  Client.find(data.id)
    .then(function(doc){
      if(!doc) doc = Client.build()
      doc.name = data.name
      doc.email = data.email
      if(data.password) doc.password = data.password
      doc.active = !!data.active
      return doc.save()
    })
    .then(function(seller){
      req.flash('success','Seller saved')
      res.redirect('/seller/edit?id=' + seller.id)
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}
