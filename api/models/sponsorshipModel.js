'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SponsorshipSchema = new Schema({
  banner: {
    data: Buffer,
    contentType: String
  },
  link: {
    type: String,
    required: true
  },
  paid: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { strict: false });


module.exports = mongoose.model('Sponsorships', SponsorshipSchema);