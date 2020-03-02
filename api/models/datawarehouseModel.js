'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const TripsPerManagerSchema = new Schema({
    _id: false,
    avgManagerTrips: {
        type: Number,
        min: 0
    },
    maxManagerTrips: {
        type: Number,
        min: 0
    },
    minManagerTrips: {
        type: Number,
        miin: 0
    },  
    stdDevManagerTrips: {
        type: Number,
        min: 0
    }
});

const ApplicationsPerTripSchema = new Schema({
    _id: false,
    avgTripApplication: {
        type: Number,
        min: 0
    },
    maxTripApplication: {
        type: Number,
        min: 0
    },
    minTripApplication: {
        type: Number,
        miin: 0
    },  
    stdDevTripApplication: {
        type: Number,
        min: 0
    }
});

const PricePerTripSchema = new Schema({
    _id: false,
    avgPrice: {
        type: Number,
        min: 0
    },
    minPrice: {
        type: Number,
        min: 0
    },
    maxPrice: {
        type: Number,
        miin: 0
    },  
    stdDevPrice: {
        type: Number,
        min: 0
    }
});

const RatioApplicationsPerStatusSchema = new Schema({
    _id: false,
    ratioPendingApplications: {
        type: Number,
        min: 0,
        max: 1
    },
    ratioRejectedApplications: {
        type: Number,
        min: 0,
        max: 1
    },
    ratioDueApplications: {
        type: Number,
        min: 0,
        max: 1
    },  
    ratioAcceptedApplications: {
        type: Number,
        min: 0,
        max: 1
    },  
    ratioCancelledApplications: {
        type: Number,
        min: 0,
        max: 1
    }
});

const AverageFindersPriceSchema = new Schema({
    _id: false,
    avgMinPrice: {
        type: Number,
        min: 0,
    },
    avgMaxPrice: {
        type: Number,
        min: 0,
    }
});

var DataWareHouseSchema = new mongoose.Schema({
    tripsPerManagers: TripsPerManagerSchema,
    applicationsPerTrip: ApplicationsPerTripSchema,
    pricePerTrip: PricePerTripSchema,
    ratioApplicationsPerStatus: RatioApplicationsPerStatusSchema,
    avgFinderPrices: AverageFindersPriceSchema,
    topFinderKeyWords: [{
        _id: false,
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
        type: Schema.Types.ObjectId,
        required: function(){
            return this.comparisonOperator == null;
        }
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
    computationMoment: {
        type: Date,
        default: Date.now
    },
})

DataWareHouseSchema.index({computationMoment: -1});
CubeSchema.index({computationMoment: -1});
CubeSchema.index({period: 'text'});

module.exports.DataWareHouse = mongoose.model('DataWareHouse', DataWareHouseSchema);
module.exports.Cube = mongoose.model('Cube', CubeSchema);