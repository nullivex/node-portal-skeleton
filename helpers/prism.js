'use strict';
var Prism = require('oose-sdk').Prism

var redis = require('../helpers/redis')

var config = require('../config')

//setup to talk to prism
var prism = new Prism({
  domain: config.oose.domain
})


/**
 * Keep a cache of purchases for reuse
 * @param {string} sha1
 * @param {string} ext
 * @return {P}
 */
prism.contentPurchaseCache = function(sha1,ext){
  var purchase
  return redis.getAsync(redis.schema.purchase(sha1))
    .then(function(result){
      if(result){
        purchase = JSON.parse(result)
      } else {
        return prism.contentPurchase(sha1,ext,config.oose.purchaseReferrer)
          .then(function(result){
            purchase = result
            //store cache
            return redis.setAsync(
              redis.schema.purchase(sha1),
              JSON.stringify(result)
            )
          })
          .then(function(){
            //make sure cache expires
            return redis.expireAsync(
              redis.schema.purchase(sha1),
              config.oose.purchaseCacheLife
            )
          })
      }
    })
    .then(function(){
      return purchase
    })
}


/**
 * Startup
 * @param {string} host
 * @param {number} port
 * @return {P}
 */
prism.doConnect = function(host,port){
  if(config.oose.token){
    prism.setSession(config.oose.token)
    return prism.connect(host,port)
  } else {
    return prism.connect(host,port)
      .then(function(){
        return prism.login(config.oose.username,config.oose.password)
      })
  }
}


/**
 * Export the instance
 * @type {Prism}
 */
module.exports = prism
