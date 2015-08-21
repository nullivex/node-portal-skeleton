'use strict';
var sequelize = require('../../helpers/sequelize')()

var Buyer = sequelize.models.Buyer



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
 * Save Buyer
 * @param {object} req
 * @param {object} res
 */
exports.save = function(req,res){
  var data = req.body
  Buyer.find(data.id)
    .then(function(doc){
      if(!doc) doc = Buyer.build()
      doc.username = data.username
      doc.email = data.email
      if(data.password) doc.password = data.password
      doc.active = true
      return doc.save()
    })
    .then(function(){
      req.flash('success','User saved')
      res.redirect('/')
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}


/**
 * Create Buyer
 * @param {object} req
 * @param {object} res
 */
exports.create = function(req,res){
  res.render('createUser')
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
