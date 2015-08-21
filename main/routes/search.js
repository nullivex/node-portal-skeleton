'use strict';
var P = require('bluebird')

var sequelize = require('../../helpers/sequelize')()
var config = require('../../config')

var Item = sequelize.models.Item
var Category = sequelize.models.Category


/**
 * Search results
 * @param {object} req
 * @param {object} res
 */
exports.index = function(req,res){
  var search = req.query.search || ''
  P.all([
    Item.findAll({
      where: sequelize.and(
        { active: true },
        sequelize.or(
          {title: {like: '%' + search + '%'}},
          {keywords: {like: '%' + search + '%'}}
        )
      ),
      limit: 30
    }),
    sequelize.query(
      'SELECT c.* FROM `Categories` AS c WHERE ' +
      '(SELECT COUNT(*) FROM `ItemCategories` AS ic ' +
      'WHERE ic.CategoryId = c.id) > ' + config.main.homeCategoryWeight + ' ' +
      'ORDER BY c.name ASC ' +
      'LIMIT 50',
      Category
    )
  ])
    .spread(function(results,categories){
      res.render('searchResult',{
        searchString: search,
        list: results,
        categoryList: categories
      })
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}
