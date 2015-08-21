'use strict';
var Shredder = require('shredder-sdk').Shredder

var config = require('../config')

//setup to talk to shredder
var shredder = new Shredder({
  username: config.shredder.username,
  password: config.shredder.password,
  domain: config.shredder.domain,
  master: {
    host: config.shredder.master.host,
    port: config.shredder.master.port
  }
})


/**
 * Startup
 * @param {string} host
 * @param {number} port
 * @return {P}
 */
shredder.doConnect = function(host,port){
  if(config.shredder.token){
    shredder.setSession(config.shredder.token)
    return shredder.connect(host,port)
  } else {
    return shredder.connect(host,port)
      .then(function(){
        return shredder.login(config.shredder.username,config.shredder.password)
      })
  }
}


/**
 * Export the instance
 * @type {Prism}
 */
module.exports = shredder
