'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FinderSchema = new Schema({
  keyWord: {
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
      'The minimum price must be lower than the max price'
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
  trips: [{
    type: Schema.Types.ObjectId,
    ref: 'Trips'
  }],
  explorer: {
    type: Schema.Types.ObjectId,
    ref: 'Actors'
  }
}, { strict: false });

FinderSchema.index({explorer: 1});

function priceValidator(value) {
  return this.maxPrice == null || this.minPrice <= value;
}

function dateValidator(value) {
  return this.dateEnd == null || this.dateStart <= value;
}

module.exports = mongoose.model('Finders', FinderSchema);