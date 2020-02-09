'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FinderSchema = new Schema({
  keyword: {
    type: String,
    default: null
  },
  minPrice: {
    type: Number,
    default: null
  },
  maxPrice: {
    type: Number,
    default: null
  },
  minDate: {
    type: Date,
    default: null
  },
  maxDate: {
    type: Date,
    default: null
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false });


module.exports = mongoose.model('Finders', FinderSchema);