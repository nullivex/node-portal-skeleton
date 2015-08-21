'use strict';
var P = require('bluebird')
var list = require('../../helpers/list')
var sequelize = require('../../helpers/sequelize')()

var Order = sequelize.models.Order
var Dispute = sequelize.models.Dispute
var Seller = sequelize.models.Seller

var config = require('../../config')


/**
 * List Disputes
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
      return Dispute.findAndCountAll({
        where: {SellerId: seller.id},
        status: 'pending',
        order: [['createdAt','DESC']],
        include: [Order]
      })
    })
    .then(function(result){
      res.render('dispute/list',{
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
 * List Resolved Disputes
 * @param {object} req
 * @param {object} res
 */
exports.resolved = function(req,res){
  var limit = +req.query.limit || 10
  var start = +req.query.start || 0
  var search = req.query.search || ''
  var seller
  if(start < 0) start = 0
  Seller.find({where: {id: req.session.seller.id}})
    .then(function(result){
      if(!result) throw new Error('Seller not found')
      seller = result
      return Dispute.findAndCountAll({
        where: {SellerId: seller.id},
        status: 'resolved',
        order: [['createdAt','DESC']],
        include: [Order]
      })
    })
    .then(function(result){
      res.render('dispute/resolved',{
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
 * List Rejected Disputes
 * @param {object} req
 * @param {object} res
 */
exports.rejected = function(req,res){
  var limit = +req.query.limit || 10
  var start = +req.query.start || 0
  var search = req.query.search || ''
  var seller
  if(start < 0) start = 0
  Seller.find({where: {id: req.session.seller.id}})
    .then(function(result){
      if(!result) throw new Error('Seller not found')
      seller = result
      return Dispute.findAndCountAll({
        where: {SellerId: seller.id},
        status: 'rejected',
        order: [['createdAt','DESC']],
        include: [Order]
      })
    })
    .then(function(result){
      res.render('dispute/rejected',{
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
 * Dispute view
 * @param {object} req
 * @param {object} res
 */
exports.detail = function(req,res){
  Dispute.find(req.query.id)
    .then(function(result){
      if(!result) throw new Error('Dispute not found')
      res.render('dispute/detail',{dispute: result})
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}

/**
 * Save dispute
 * @param {object} req
 * @param {object} res
 */
exports.save = function(req,res){
  var data = req.body
  Dispute.find(data.id)
    .then(function(dispute){
      if(!dispute) dispute = Dispute.build()
      if(data.status) dispute.status = data.status
      if(!data.status) dispute.status = 'pending'
      if(data.actionRequested) dispute.actionRequested = data.actionRequested
      if(data.message) dispute.message = data.message
      return P.all([
        dispute.save()
      ])
    })
    .then(function(results){
      req.flash('success','Dispute Saved')
      res.redirect('/dispute/detail?id=' + results[0].id)
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}


/**
 * Dispute List Action
 * @param {object} req
 * @param {object} res
 */
/*exports.listAction = function(req,res){
 list.remove(Dispute,req.body.remove)
 .then(function(){
 req.flash('success','Buyer dispute(s) removed successfully')
 res.redirect('/dispute/list')
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
/*exports.listActionRejected = function(req,res){
 list.remove(Dispute,req.body.remove)
 .then(function(){
 req.flash('success','Rejected Dispute(s) successfully')
 res.redirect('/dispute/rejected')
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
/*exports.listActionResolved = function(req,res){
 list.remove(Dispute,req.body.remove)
 .then(function(){
 req.flash('success','Resolved Dispute(s) successfully')
 res.redirect('/dispute/resolved')
 })
 .catch(function(err){
 res.render('error',{error: err})
 })
 }
 */