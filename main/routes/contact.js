'use strict';
var P = require('bluebird')
var Recaptcha = require('recaptcha').Recaptcha
var nodemailer = require('nodemailer')
var jade = require('jade')

var sequelize = require('../../helpers/sequelize')()

var ContactEmail = sequelize.models.ContactEmail

var config = require('../../config')


/**
 * Contact Us
 * @param {object} req
 * @param {object} res
 */
exports.index = function(req,res){
  var recaptcha = new Recaptcha(
    config.recaptcha.publicKey,
    config.recaptcha.privateKey
  )
  res.render('contact',{
    recaptcha: recaptcha.toHTML()
  })
}


/**
 * Save
 * @param {object} req
 * @param {object} res
 */
exports.save = function(req,res){
  var data = req.body
  var recaptcha = new Recaptcha(
    config.recaptcha.publicKey,
    config.recaptcha.privateKey,
    {
      remoteip: req.ip,
      challenge: req.body.recaptcha_challenge_field, // jshint ignore:line
      response: req.body.recaptcha_response_field // jshint ignore:line
    }
  )
  new P(function(resolve,reject){
    recaptcha.verify(function(success){
      if(success) return resolve()
      else reject('Captcha response invalid')
    })
  })
    .then(function(){
      ContactEmail.create({
        email: data.email,
        name: data.name,
        message: data.message
      })
    })
    .then(function(){
      var fn = jade.compileFile('main/themes/animegg/views/contactTemplate.jade')
      var html = fn({data: data})
      var transporter = nodemailer.createTransport({
        service: config.gmailcontact.service,
        auth: config.gmailcontact.auth
      });
      transporter.sendMail({
        from: config.gmailcontact.from,
        to: config.gmailcontact.to,
        subject: 'New Animegg Contact Email',
        html: html
      })
    })
    .then(function(){
      req.flash('success','Email sent successfully')
      res.redirect('/')
    })
    .catch(function(err){
      req.flash('error','There was an error filing the report ' + err)
      res.redirect('/')
    })
}
