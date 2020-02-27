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

const period_enum = ['M01','M02','M03','M04','M05','M06','M07','M08','M09','M10','M11','M12','M13','M14','M15','M16','M17',
    'M18','M19','M20','M21','M22','M23','M24','M25','M26','M27','M28','M29','M30','M31','M32','M33','M34','M35','M36',
    'Y01','Y02','Y03'];

var CubeSchema = new mongoose.Schema({
    explorer: {
        type: Schema.Types.ObjectId
    },
    explorers:{
        type: [Schema.Types.ObjectId]
    },
    period: {
        type: String,
        required: 'Kindly enter the period of time',
        enum: period_enum
    },
    money:{
        type: Number,
        required: true,
        min: 0
    },
    comparisonOperator:{
        type: String,
        enum: ['=', '!=', '>', '>=', '<', '<=']
    },
    computationMoment: {
        type: Date,
        default: Date.now
    },
})

DataWareHouseSchema.index({computationMoment: -1});
CubeSchema.index({computationMoment: -1});

module.exports = mongoose.model('DataWareHouse', DataWareHouseSchema);
module.exports = mongoose.model('Cube', CubeSchema);