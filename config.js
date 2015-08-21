'use strict';
var fs = require('graceful-fs')
var ObjectManage = require('object-manage')

var config
var pkg = require('./package.json')

//setup config object
config = new ObjectManage()
//dist config schema
config.$load({
  title: 'Node Skeleton',
  name: 'node-skeleton',
  version: pkg.version,
  //databases
  redis: {
    host: '127.0.0.1',
    port: 6379,
    db: 0,
    prefix: 'project',
    options: {}
  },
  mysql: {
    name: 'project',
    host: '127.0.0.1',
    port: 3306,
    user: '',
    password: '',
    logging: false
  },
  //services
  email:{
    service: 'gmail',
    auth: {
      user: 'notify@localhost',
      pass: 'password'
    },
    to: 'notify@localhost',
    from: ' Contact Email! <notify@localhost>'
  },
  //instances
  admin: {
    enabled: false,
    port: 3003,
    host: null,
    baseUrl: 'http://localhost:3003',
    theme: 'default',
    workers: {
      count: 1,
      maxConnections: 10000
    },
    cookie: {
      secret: '',
      maxAge: 2592000000 //30 days
    }
  },
  client: {
    enabled: false,
    port: 3005,
    host: null,
    baseUrl: 'http://localhost:3005',
    theme: 'default',
    workers: {
      count: 1,
      maxConnections: 10000
    },
    cookie: {
      secret: '',
      maxAge: 2592000000 //30 days
    }
  },
  main: {
    enabled: false,
    port: 3000,
    host: null,
    baseUrl: 'http://localhost:3000',
    theme: 'default',
    workers: {
      count: 1,
      maxConnections: 10000
    },
    cookie: {
      secret: '',
      maxAge: 2592000000 //30 days
    }
  }
})

//load user config
if(fs.existsSync(__dirname + '/config.local.js')){
  config.$load(require(__dirname + '/config.local.js'))
}

//load instance overrides
if(process.env.NODE_CONFIG){
  config.$load(require(process.env.NODE_CONFIG))
}


/**
 * Export config
 * @type {ObjectManage}
 */
module.exports = config
