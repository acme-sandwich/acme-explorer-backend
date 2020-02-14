'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
  moment: {
    type: Date,
    required: 'Kindly enter the actor name',
    default: Date.now()
  },
  status: {
    type: String,
    required: 'Kindly enter the actor surname'
  },
  comment: {
    type: String,
  },
  reason: {
    type: String,
  },
}, { strict: false });

module.exports = mongoose.model('Applications', ApplicationSchema);