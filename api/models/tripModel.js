'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const generate = require('nanoid/generate');

var StageSchema = new Schema({
    title: {
      type: String,
      required: 'Kindly enter the title of the stage',
      trim: true
    },
    description:{
        type: String,
        required: 'Kindly enter the description of the stage',
        trim: true
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
        unique: true,
            validate: {
            validator: function(v) {
                return /^\d{6}-[A-Z]{4}$/.test(v);
            },
            message: 'ticker is not valid!, Pattern("^\d{6}-[A-Z]{4}$")'
        }
    },
    title: {
        type: String,
        required: 'Kindly enter the title',
        trim: true
    },
    description: {
        type: String,
        required: 'Kindly enter the description',
        trim: true
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
        required: [dateValidator, 'Start Date must be less or equal than End Date']
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
    cancelledReason: { // Required when cancelled = True.
        type: String,
        trim: true,
        required: function(){
            return this.cancelled;
        }
    },
    stages: [StageSchema],
    creator:{ // The Actor creator must have manager as role.
        type: Schema.Types.ObjectId,
        ref: 'Actors'
    },
    created: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, { strict: false });

TripSchema.pre('save', function(callback) {
    var new_trip = this;
    var today = new Date();
    var month = '' + (today.getMonth() + 1);
    var day = '' + today.getDate();
    var year = '' + today.getFullYear();
    year = year.slice(-2);
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    today_string = year + month + day;
    random_generation = generate('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 4);
    new_trip.ticker = today_string + random_generation;
    callback();
  });

  function dateValidator(value){
      return this.startDate <= value;
  }

module.exports = mongoose.model('Trips', TripSchema);
// Commented for now. Not sure if a new collection should be created for Stages, or if
// they should be embeded inside Trips.
//module.exports = mongoose.model('Stages', StageSchema);