'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
  moment: {
    type: Date,
    required: 'Kindly enter the application moment',
    default: Date.now()
  },
  status: {
    type: String,
    required: 'Kindly enter the application status',
    enum: ['PENDING', 'REJECTED', 'DUE', 'ACCEPTED', 'CANCELLED']
  },
  comment: {
    type: String,
  },
  reason: {
    type: String,
  },
  trip: {
    type: Schema.Types.ObjectId,
    ref: 'Trips'
  },
  explorer: {
    type: Schema.Types.ObjectId,
    ref: 'Actors'
  }
}, { strict: false });

ApplicationSchema.index({moment: 1});
ApplicationSchema.index({trip: 1})
ApplicationSchema.index({explorer: 1});
ApplicationSchema.index({explorer: 1, status: 'text'});

module.exports = mongoose.model('Applications', ApplicationSchema);