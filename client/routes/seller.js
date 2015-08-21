'use strict';
var sequelize = require('../../helpers/sequelize')()

var Seller = sequelize.models.Seller



/**
 * Seller login
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
  Seller.login(req.body.email,req.body.password)
    .then(function(result){
      req.session.seller = result.toJSON()
      res.redirect('/')
    })
    .catch(function(err){
      req.flash('error',err)
      res.render('login')
    })
}


/**
 * Staff logout
 * @param {object} req
 * @param {object} res
 */
exports.logout = function(req,res){
  delete req.session.seller
  res.redirect('/login')
}
