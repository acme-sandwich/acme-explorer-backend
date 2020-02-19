'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FinderSchema = new Schema({
  keyWord: {
    type: String,
    default: null
  },
  maxPrice: {
    type: Number,
    default: null,
    min: 0
  },
  minPrice: {
    type: Number,
    default: null,
    min: 0,
    validate: [
      priceValidator,
      'PriceUp must be lower than PriceDown'
    ]
  },
  dateStart: {
    type: Date,
    default: null
  },
  dateEnd: {
    type: Date,
    default: null,
    validate: [
      dateValidator,
      'DateStart must be earlier than DateEnd'
    ]
  },
  moment: {
    type: Date,
    default: Date.now
  },
  explorer: {
    type: Schema.Types.ObjectId,
    ref: 'Actors'
  }
}, { strict: false });

function priceValidator(value) {
  return this.priceDown == null || this.priceUp <= value;
}

function dateValidator(value) {
  return this.dateEnd == null || this.dateStart <= value;
}

module.exports = mongoose.model('Finders', FinderSchema);