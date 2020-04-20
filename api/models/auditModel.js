'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AuditSchema = new Schema({
  moment: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: 'Kindly enter the title'
  },
  description: {
    type: String,
    required: 'Kindly enter the description'
  },
  attachments: [{
    type: String
  }],
  auditor: {
    type: Schema.Types.ObjectId,
    ref: 'Actors'
  },
  trip: {
    type: Schema.Types.ObjectId,
    ref: 'Trips'
  }
}, { strict: false });

AuditSchema.index({auditor: 1});

module.exports = mongoose.model('Audits', AuditSchema);