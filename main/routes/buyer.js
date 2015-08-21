'use strict';
var list = require('../../helpers/list')
var sequelize = require('../../helpers/sequelize')()

var Buyer = sequelize.models.Buyer


/**
 * Create buyer member
 * @param {object} req
 * @param {object} res
 */
exports.create = function(req,res){
  res.render('buyer/create')
}


/**
 * Buyer edit form
 * @param {object} req
 * @param {object} res
 */
exports.edit = function(req,res){
  Buyer.find({where: {id: req.session.buyer.id}})
    .then(function(result){
      if(!result) throw new Error('User not found')
      res.render('buyer/profile',{buyer: result})
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}


/**
 * Save buyer member
 * @param {object} req
 * @param {object} res
 */
exports.save = function(req,res){
  var data = req.body
  Buyer.find(data.id)
    .then(function(doc){
      if(!doc) doc = Buyer.build()
      doc.name = data.name
      doc.email = data.email
      if(data.password) doc.password = data.password
      doc.active = !!data.active
      return doc.save()
    })
    .then(function(buyer){
      req.flash('success','Buyer member saved')
      res.redirect('/buyer/edit?id=' + buyer.id)
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}


/**
 * Buyer login
 * @param {object} req
 * @param {object} res
 */
exports.login = function(req,res){
  res.render('login')
}


/**
 * Login action
 * @param {object} req
 * @param {object} res
 */
exports.loginAction = function(req,res){
  Buyer.login(req.body.email,req.body.password)
    .then(function(result){
      req.session.buyer = result.toJSON()
      res.redirect('/')
    })
    .catch(function(err){
      req.flash('error',err)
      res.render('login')
    })
}


/**
 * Buyer logout
 * @param {object} req
 * @param {object} res
 */
exports.logout = function(req,res){
  delete req.session.buyer
  res.redirect('/login')
}
