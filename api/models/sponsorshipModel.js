'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SponsorshipSchema = new Schema({
  banner: {
    data: Buffer,
    contentType: String,
    required: true
  },
  landingPage: {
    type: String,
    required: true
  },
  payed: {
    type: Boolean,
    default: false
  }
}, { strict: false });


module.exports = mongoose.model('Sponsorships', SponsorshipSchema);