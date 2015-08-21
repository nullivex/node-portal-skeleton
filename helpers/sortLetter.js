'use strict';


/**
 * Make a sortletter safe
 * @param {string} sortLetter
 * @return {string}
 */
exports.format = function(sortLetter){
  sortLetter = sortLetter.toLowerCase()
  sortLetter = sortLetter.replace(/[^a-z\s\-]+/g,'#')
  return sortLetter
}
