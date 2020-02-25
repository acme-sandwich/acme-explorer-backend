'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DataWareHouseSchema = new mongoose.Schema({
    tripsPerManagers: [{
        type: Number
    }],
    applicationsPerTrip: [{
        type: Number
    }],
    pricePerTrip: [{
        type: Number
    }],
    ratioApplicationsPerStatus: [{
        type: Number,
        min: 0,
        max: 1
    }],
    avgFinderPrices: {
        type: Number,
        min: 0
    },
    topFinderKeyWords: [{
        keyword: String,
        keywordSum: Number
    }],
    computationMoment: {
        type: Date,
        default: Date.now
    },
    rebuildPeriod: {
        type: String
    }
}, {strict: false});

DataWareHouseSchema.index({computationMoment: -1});

module.exports = mongoose.model('DataWareHouse', DataWareHouseSchema);