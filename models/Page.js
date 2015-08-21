'use strict';
var markdown = require('markdown').markdown
var validator = require('validator')


/**
 * Exporting the model
 * @param {object} sequelize
 * @param {object} DataTypes
 * @return {object}
 */
module.exports = function(sequelize,DataTypes) {
  return sequelize.define('Page',{
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uri: {
      type: DataTypes.STRING(191),
      allowNull: true,
      validate: {is: /^[/a-z0-9_\-]+$/i}
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    html: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    indexes: [
      {
        name: 'uri_unique',
        unique: true,
        method: 'BTREE',
        fields: ['uri']
      }
    ],
    hooks: {
      beforeUpdate: function(page,fields,done){
        page.content = validator.trim(page.content)
        page.content = validator.escape(page.content)
        page.html = markdown.toHTML(page.content)
        done(null,page)
      }
    }
  })
}
