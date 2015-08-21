'use strict';
var moment = require('moment')
var RSS = require('rss')

var sequelize = require('../../helpers/sequelize')()

var Show = sequelize.models.Show
var Episode = sequelize.models.Episode
var Video = sequelize.models.Video

var config = require('../../config')

//setup base urls
var base = config.main.sitemap.baseUrl


/**
 * Generate RSS feed
 * @param {object} req
 * @param {object} res
 */
exports.index = function(req,res){
  var feed = new RSS({
    title: 'Anime News Feed From' + ' ' + base,
    description: 'New Anime Episodes Updated Daily',
    feed_url: base + '/rss', //jshint ignore:line
    site_url: base, //jshint ignore:line
    image_url: base + '/images/anime.png', //jshint ignore:line
    author: 'Anime' + ' ' + base,
    managingEditor: 'Anime' + ' ' + base,
    webMaster: 'Anime' + ' ' + base,
    language: 'en',
    categories: ['Anime','Online','Enterainment','Cartoon'],
    pubDate: moment.utc().toDate(),
    ttl: '60'
  })
  Video.findAll({
    where: {recentlyReleased: true},
    limit: 20,
    order: [['createdAt','DESC']],
    include: [Show,Episode]
  })
    .then(function(results){
      var release
      for(var i = 0; i<results.length; i++){
        release = results[i]
        feed.item({
          title:
            release.Show.title + ' ' +
            release.Episode.viewNumber(true) + ' ' +
            release.version,
          description: release.Episode.description || release.Show.description,
          url: base + '/' + release.Episode.uri,
          guid: release.id,
          author: release.Show.title,
          date: moment.utc(release.createdAt).toDate()
        })
      }
      res.type('xml')
      res.send(feed.xml('  '))
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}
