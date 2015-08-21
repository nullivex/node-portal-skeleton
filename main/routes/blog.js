'use strict';
var sequelize = require('../../helpers/sequelize')()

var Blog = sequelize.models.Blog


/**
 * List
 * @param {object} req
 * @param {object} res
 */
exports.index = function(req,res){
  Blog.findAll({order: [['datePosted','DESC']]})
    .then(function(result){
      res.render('blog',{
        blogList: result
      })
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}