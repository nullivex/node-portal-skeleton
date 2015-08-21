'use strict';


/**
 * Items
 * @type {exports}
 */
exports.item = require('./item')


/**
 * Seller
 * @type {exports}
 */
exports.seller = require('./seller')


/**
 * Orders
 * @type {exports}
 */
exports.order = require('./order')


/**
 * Seller Ledger
 * @type {exports}
 */
exports.ledger = require('./ledger')


/**
 * Disputes
 * @type {exports}
 */
exports.dispute = require('./dispute')


/**
 * Index
 * @param {object} req
 * @param {object} res
 */
exports.index = function(req,res){
  res.redirect('/items/list')
}
