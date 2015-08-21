'use strict';
var P = require('bluebird')
var jade = require('jade')
var moment = require('moment')
var path = require('path')
var Sitemap = require('sitemap').Sitemap
var zlib = require('zlib')

var sequelize = require('../../helpers/sequelize')()

var Episode = sequelize.models.Episode
var Show = sequelize.models.Show

var config = require('../../config')

//setup base urls
var base = config.main.sitemap.baseUrl

//make some promises
P.promisifyAll(zlib)


/**
 * Sitemap index
 * @param {object} req
 * @param {object} res
 */
exports.index = function(req,res){
  var tpl = path.resolve(__dirname + '/../views/sitemapIndex.jade')
  var xml = jade.renderFile(tpl,{
    base: base,
    now: moment.utc().format('YYYY-MM-DDThh:mmZ')
  })
  zlib.gzipAsync(new Buffer(xml,'utf-8'))
    .then(function(result){
      res.set('Content-Type: application/x-gzip')
      res.set('Content-Encoding: gzip')
      res.set(
        'Content-Disposition: attachment; filename="sitemap_static.xml.gz"')
      res.end(result)
    })
}


/**
 * Static pages
 * @param {object} req
 * @param {object} res
 */
exports.staticPages = function(req,res){
  var urls = [
    {url: base + '/', changefreq: 'daily', priority: 0.4},
    {url: base + '/series', changefreq: 'daily', priority: 0.5},
    {url: base + '/ongoing-series', changefreq: 'daily', priority: 0.4},
    {url: base + '/popular-series', changefreq: 'daily', priority: 0.5},
    {url: base + '/release-schedule', changefreq: 'daily', priority: 0.5},
    {url: base + '/blog', changefreq: 'daily', priority: 0.4},
    {url: base + '/rss', changefreq: 'daily', priority: 0.5},
    {url: base + '/terms-of-service', changefreq: 'monthly', priority: 0.1},
    {url: base + '/privacy-policy', changefreq: 'monthly', priority: 0.1}
  ]
  //letters for iteration
  var letters = [
    '0-9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o',
    'p','q','r','s','t','u','v','w','x','u','z'
  ]
  //add letter listing urls
  for(var i=0; i < letters.length; i++){
    urls.push({
      url: base + '/animeg/' + letters[i] + '/series',
      changefreq: 'daily',
      prioirty: 0.4
    })
  }
  var map = new Sitemap(urls,base)
  map.toXML(function(xml){
    zlib.gzipAsync(new Buffer(xml,'utf-8'))
      .then(function(result){
        res.set('Content-Type: application/x-gzip')
        res.set('Content-Encoding: gzip')
        res.set(
          'Content-Disposition: attachment; filename="sitemap_static.xml.gz"')
        res.end(result)
      })
  })
}


/**
 * Sitemap shows
 * @param {object} req
 * @param {object} res
 */
exports.shows = function(req,res){
  var offset = req.params.offset
  var limit = config.main.sitemap.maxUrlCount
  var start = limit * (offset - 1)
  var urls = []
  Show.findAll(
    {
      offset: start,
      limit: limit,
      order: ['sortLetter','title']
    },
    {
      raw: true
    }
  )
    .then(function(shows){
      for(var i = 0; i < shows.length; i++){
        urls.push({
          url: base + '/series/' + shows[i].uri,
          changefreq: 'daily',
          priority: 0.7
        })
      }
      var map = new Sitemap(urls,base)
      map.toXML(function(xml){
        zlib.gzipAsync(new Buffer(xml,'utf-8'))
          .then(function(result){
            res.set('Content-Type: application/x-gzip')
            res.set('Content-Encoding: gzip')
            res.set(
              'Content-Disposition: attachment;' +
              ' filename="sitemap_shows_' + offset + '.xml.gz"')
            res.end(result)
          })
      })
    })
}


/**
 * Sitemap episodes
 * @param {object} req
 * @param {object} res
 */
exports.episodes = function(req,res){
  var offset = req.params.offset
  var limit = config.main.sitemap.maxUrlCount
  var start = limit * (offset - 1)
  var urls = []
  Episode.findAll(
    {
      offset: start,
      limit: limit,
      include: [Show],
      order: [[Show,'sortLetter'],[Show,'title'],'number']
    },
    {
      raw: true
    }
  )
    .then(function(episodes){
      for(var i = 0; i < episodes.length; i++){
        urls.push({
          url: base + '/' + episodes[i].uri,
          changefreq: 'daily',
          priority: 0.9
        })
      }
      var map = new Sitemap(urls,base)
      map.toXML(function(xml){
        zlib.gzipAsync(new Buffer(xml,'utf-8'))
          .then(function(result){
            res.set('Content-Type: application/x-gzip')
            res.set('Content-Encoding: gzip')
            res.set(
              'Content-Disposition: attachment;' +
              ' filename="sitemap_episodes_' + offset + '.xml.gz"')
            res.end(result)
          })
      })
    })
}
