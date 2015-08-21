'use strict';


/**
 * Pages
 * @type {exports}
 */
exports.page = require('./page')


/**
 * Disputes
 * @type {exports}
 */
exports.dispute = require('./dispute')


/**
 * Items
 * @type {exports}
 */
exports.item = require('./item')


/**
 * Orders
 * @type {exports}
 */
exports.order = require('./order')


/**
 * Sellers
 * @type {exports}
 */
exports.seller = require('./seller')


/**
 * Staff
 * @type {exports}
 */
exports.staff = require('./staff')


/**
 * Buyers
 * @type {exports}
 */
exports.buyer = require('./buyer')


/**
 * Blog
 * @type {exports}
 */
exports.blog = require('./blog')


/**
 * Index
 * @param {object} req
 * @param {object} res
 */
exports.index = function(req,res){
  res.redirect('/order/list')
}
