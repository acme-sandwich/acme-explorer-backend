'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfigurationSchema = new Schema({
    resultsNumberFinder: {
      type: Number,
      min:10, max:100,
      default: 10
    },
    resultsTimeFinder: {
        type: Number,
        min:1, max:24,
        default: 1
      },
    sponsorshipRate: {
      type: Number,
      required: 'Kindly enter the price of sponsor a trip.',
      min: 0
    }
  }, { strict: false });

  module.exports = mongoose.model('Configuration', ConfigurationSchema);