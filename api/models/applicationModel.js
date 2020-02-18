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
    enum: ['PENDING', 'REJECTED', 'DUE', 'ACCEPTED', 'CANCELLED'],
    default: 'PENDING'
  },
  comment: {
    type: String,
  },
  reason: {
    type: String,
    required: function(){
      return this.status === 'REJECTED'; // En caso de que un manager te rechace la reason es obligatoria
    }
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

ApplicationSchema.index({status: 'text'});
ApplicationSchema.index({moment: 1});
ApplicationSchema.index({trip: 1})
ApplicationSchema.index({explorer: 1, status: 1});

module.exports = mongoose.model('Applications', ApplicationSchema);