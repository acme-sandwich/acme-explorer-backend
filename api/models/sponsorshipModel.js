'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SponsorshipSchema = new Schema({
  banner: {
    data: Buffer,
    contentType: String
  },
  landingPage: {
    type: String,
    required: true
  },
  payed: {
    type: Boolean,
    default: false
  },
  sponsor:{
    type: Schema.Types.ObjectId,
    ref: 'Actors'
},
trips:[{
  type: Schema.Types.ObjectId,
  ref: 'Trips'
}]
}, { strict: false });


module.exports = mongoose.model('Sponsorships', SponsorshipSchema);