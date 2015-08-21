'use strict';
var sequelize = require('../../helpers/sequelize')()

var User = sequelize.models.User


/**
 * Profile
 * @param {object} req
 * @param {object} res
 */
exports.index = function(req,res){
  User.find(req.session.user._id)
    .then(function(result){
      res.render('profile', {user: result})
    })
    .catch(function(err){
      req.flash(err, err.message)
      res.redirect('/login')
    })
}


/**
 * @param {object} req
 * @param {object} res
 */
exports.save = function(req,res){
  var data = req.body
  User.find(req.session.user._id)
    .then(function(user){
      if(!user) user = User.build()
      user.name = data.name || ''
      user.email = data.email || ''
      user.image = data.image || ''
      return user.save()
    })
    .then(function(){
      req.flash('success','Profile Saved')
      res.redirect('/')
    })
    .catch(function(err){
      req.flash('error',err.message)
      res.redirect('/')
    })
}
