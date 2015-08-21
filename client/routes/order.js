'use strict';
var P = require('bluebird')
var list = require('../../helpers/list')
var sequelize = require('../../helpers/sequelize')()

var Order = sequelize.models.Order
var Seller = sequelize.models.Seller

var config = require('../../config')


/**
 * List orders
 * @param {object} req
 * @param {object} res
 */
exports.list = function(req,res){
  var limit = +req.query.limit || 10
  var start = +req.query.start || 0
  var search = req.query.search || ''
  var seller
  if(start < 0) start = 0
  Seller.find({where: {id: req.session.seller.id}})
    .then(function(result){
      if(!result) throw new Error('Seller not found')
      seller = result
      return Order.findAndCountAll({
        where: {SellerId: seller.id},
        order: [['createdAt','DESC']]
      })
    })
    .then(function(result){
      res.render('order/list',{
        page: list.pagination(start,result.count,limit),
        count: result.count,
        search: search,
        limit: limit,
        list: result.rows,
        mainBaseUrl: config.seller.mainBaseUrl
      })

    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}


/**
 * List Pending Orders
 * @param {object} req
 * @param {object} res
 */
exports.pending = function(req,res){
  var limit = +req.query.limit || 10
  var start = +req.query.start || 0
  var search = req.query.search || ''
  var seller
  if(start < 0) start = 0
  Seller.find({where: {id: req.session.seller.id}})
    .then(function(result){
      if(!result) throw new Error('Seller not found')
      seller = result
      return Order.findAndCountAll({
        where: {SellerId: seller.id},
        order: [['createdAt','DESC']],
        status: 'pending'
      })
    })
    .then(function(result){
      res.render('order/pending',{
        page: list.pagination(start,result.count,limit),
        count: result.count,
        search: search,
        limit: limit,
        list: result.rows,
        mainBaseUrl: config.seller.mainBaseUrl
      })

    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}


/**
 * List Complete Orders
 * @param {object} req
 * @param {object} res
 */
exports.complete = function(req,res){
  var limit = +req.query.limit || 10
  var start = +req.query.start || 0
  var search = req.query.search || ''
  var seller
  if(start < 0) start = 0
  Seller.find({where: {id: req.session.seller.id}})
    .then(function(result){
      if(!result) throw new Error('Seller not found')
      seller = result
      return Order.findAndCountAll({
        where: {SellerId: seller.id},
        order: [['createdAt','DESC']],
        status: 'complete'
      })
      .then(function(result){
        res.render('order/complete',{
          page: list.pagination(start,result.count,limit),
          count: result.count,
          search: search,
          limit: limit,
          list: result.rows,
          mainBaseUrl: config.seller.mainBaseUrl
        })
      })
      .catch(function(err){
        res.render('error',{error: err})
      })
    })
}


/**
 * List Awaiting FeedBack Orders
 * @param {object} req
 * @param {object} res
 */
exports.feedback = function(req,res){
  var limit = +req.query.limit || 10
  var start = +req.query.start || 0
  var search = req.query.search || ''
  var seller
  if(start < 0) start = 0
  Seller.find({where: {id: req.session.seller.id}})
    .then(function(result){
      if(!result) throw new Error('Seller not found')
      seller = result
      return Order.findAndCountAll({
        where: {SellerId: seller.id},
        order: [['createdAt','DESC']],
        status: 'awaiting feedback'
      })
      .then(function(result){
        res.render('order/feedback',{
          page: list.pagination(start,result.count,limit),
          count: result.count,
          search: search,
          limit: limit,
          list: result.rows,
          mainBaseUrl: config.seller.mainBaseUrl
        })

      })
      .catch(function(err){
        res.render('error',{error: err})
      })
    })
}


/**
 * List Shipped Orders
 * @param {object} req
 * @param {object} res
 */
exports.shipped = function(req,res){
  var limit = +req.query.limit || 10
  var start = +req.query.start || 0
  var search = req.query.search || ''
  var seller
  if(start < 0) start = 0
  Seller.find({where: {id: req.session.seller.id}}).then(function(result){
      if(!result) throw new Error('Seller not found')
      seller = result
      return Order.findAndCountAll({
        where: {SellerId: seller.id},
        order: [['createdAt','DESC']],
        status: 'shipped'
      }).then(function(result){
          res.render('order/shipped',{
            page: list.pagination(start,result.count,limit),
            count: result.count,
            search: search,
            limit: limit,
            list: result.rows,
            mainBaseUrl: config.seller.mainBaseUrl
          })

        }).catch(function(err){
          res.render('error',{error: err})
        })
    })
}


/**
 * Order view
 * @param {object} req
 * @param {object} res
 */
exports.detail = function(req,res){
  Order.find(req.query.id)
    .then(function(result){
      if(!result) throw new Error('Dispute not found')
      res.render('order/detail',{order: result})
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}


/**
 * Save order
 * @param {object} req
 * @param {object} res
 */
exports.save = function(req,res){
  var data = req.body
  Order.find(data.id)
    .then(function(order){
      if(!order) order = Order.build()
      order.SellerId = req.session.seller.id
      if(data.status) order.status = data.status
      if(!data.status) order.status = 'pending'
      if(data.balance) order.balance = data.balance
      if(data.items) order.items = data.items
      if(data.transactionNumber) order.transactionNumber = data.transactionNumber
      return P.all([
        order.save()
      ])
    })
    .then(function(results){
      req.flash('success','Order Saved')
      res.redirect('/order/detail?id=' + results[0].id)
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}