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
    default: null,
    min: 0
  },
  maxPrice: {
    type: Number,
    default: null,
    min: 0,
    validate: [
      priceValidator,
      'MinPrice must be lower than MaxDate'
    ]
  },
  minDate: {
    type: Date,
    default: null
  },
  maxDate: {
    type: Date,
    default: null,
    validate: [
      dateValidator,
      'MinDate must be earlier than MaxDate'
    ]
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false });

function priceValidator(value) {
  return this.minPrice <= value;
}

function dateValidator(value) {
  return this.minDate <= value;
}

module.exports = mongoose.model('Finders', FinderSchema);