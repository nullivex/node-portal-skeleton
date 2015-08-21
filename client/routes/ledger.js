'use strict';
var sequelize = require('../../helpers/sequelize')()

var SellerLedger = sequelize.models.SellerLedger


/**
 * List Ledger
 * @param {object} req
 * @param {object} res
 */
exports.list = function(req,res){
  SellerLedger.find({where: {SellerId: req.session.seller.id}})
    .then(function(result){
      res.render('seller/ledger',{
        seller: result
      })
    })
    .catch(function(err){
      res.render('error',{error: err})
    })
}
