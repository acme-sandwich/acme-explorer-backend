'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StageSchema = new Schema({
    title: {
      type: String,
      required: 'Kindly enter the title of the stage'
    },
    description:{
        type: String,
        required: 'Kindly enter the description of the stage'
    },
    price: {
      type: Number,
      required: 'Kindly enter the price of the stage. Minimum is zero',
      min: 0
    },
    created: {
      type: Date,
      default: Date.now
    }
  }, { strict: false });

var TripSchema = new Schema({
    ticker: { // Required but created automatically.
        type: String,
    },
    title: {
        type: String,
        required: 'Kindly enter the title'
    },
    description: {
        type: String,
        required: 'Kindly enter the description'
    },
    price: { // Not compulsory, calculated when stages are created / modified / removed.
        type: Number,
        min: 0
    },
    requirements: {
        type: String,
        required: 'Kindly enter the requirements'
    },
    startDate: {
        type: Date,
        required: 'Kindly enter the start date'
    },
    endDate: {
        type: Date,
        required: 'Kindly enter the end date'
    },
    picture: [{
        data: Buffer, 
        contentType: String
    }],
    published: {
        type: Boolean,
        default: false
    },
    cancelled: {
        type: Boolean,
        default: false
    },
    cancelledReason: { // Compulsory when cancelled = True.
        type: String
    },
    stages: [StageSchema],
    creator:{ // The Actor creator must have manager as role.
        type: Schema.Types.ObjectId,
        ref: 'Actors'
    },
    created: {
        type: Date,
        default: Date.now
    }
}, { strict: false });

module.exports = mongoose.model('Trips', TripSchema);
// Commented for now. Not sure if a new collection should be created for Stages, or if
// they should be embeded inside Trips.
//module.exports = mongoose.model('Stages', StageSchema);