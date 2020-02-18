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
        required: 'Kindly enter the time of the results of the finder',
        min:10, max:24
      },
    sponsorshipRate: {
      type: Number,
      required: 'Kindly enter the price of sponsor a trip.',
      min: 0
    }
  }, { strict: false });

  module.exports = mongoose.model('Configuration', ConfigurationSchema);