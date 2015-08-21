'use strict';



/**
 * Redis Key Schema
 * @param {string} prefix
 * @constructor
 */
var RedisSchema = function(prefix){
  if(!prefix) prefix = 'animegg'
  this.prefix = prefix
}


/**
 * Apply Key Prefix
 * @param {string} key
 * @return {string}
 */
RedisSchema.prototype.applyPrefix = function(key){
  return this.prefix + ':' + key
}


/**
 * Key used to flush db on prism start
 * @return {string}
 */
RedisSchema.prototype.flushKeys = function(){
  return this.applyPrefix('*')
}


/**
 * Look up a purchase
 * @param {string} sha1
 * @return {string}
 */
RedisSchema.prototype.purchase = function(sha1){
  return this.applyPrefix('purchase:' + sha1)
}


/**
 * Export Object
 * @type {RedisSchema}
 */
module.exports = RedisSchema
