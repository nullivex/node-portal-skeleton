'use strict';
var list = require('../../helpers/list')
var sequelize = require('../../helpers/sequelize')()

var Staff = sequelize.models.Staff


/**
 * List staff members
 * @param {object} req
 * @param {object} res
 */
exports.list = function(req,res){
  var limit = +req.query.limit || 10
  var start = +req.query.start || 0
  var search = req.query.search || ''
  if(start < 0) start = 0
  Staff.findAndCountAll({
    where: sequelize.or(
      {email: {like: '%' + search + '%'}},
      {name: {like: '%' + search + '%'}}
    ),
    limit: limit,
    offset: start
  })
    .then(function(result){
      res.render('staff/list',{
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
  list.remove(Staff,req.body.remove)
    .then(function(){
      req.flash('success','Staff removed successfully')
      res.redirect('/staff/list')
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}


/**
 * Create staff member
 * @param {object} req
 * @param {object} res
 */
exports.create = function(req,res){
  res.render('staff/create')
}


/**
 * Staff edit form
 * @param {object} req
 * @param {object} res
 */
exports.edit = function(req,res){
  Staff.find(req.query.id)
    .then(function(result){
      if(!result) throw new Error('Staff member not found')
      res.render('staff/edit',{staff: result})
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}


/**
 * Save staff member
 * @param {object} req
 * @param {object} res
 */
exports.save = function(req,res){
  var data = req.body
  Staff.find(data.id)
    .then(function(doc){
      if(!doc) doc = Staff.build()
      doc.name = data.name
      doc.email = data.email
      if(data.password) doc.password = data.password
      doc.active = !!data.active
      return doc.save()
    })
    .then(function(staff){
      req.flash('success','Staff member saved')
      res.redirect('/staff/edit?id=' + staff.id)
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}


/**
 * Staff login
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
  Staff.login(req.body.email,req.body.password)
    .then(function(result){
      req.session.staff = result.toJSON()
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
  delete req.session.staff
  res.redirect('/login')
}
