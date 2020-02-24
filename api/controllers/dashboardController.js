'use strict';
/*---------------DASHBOARD----------------------*/
var mongoose = require('mongoose'),
	Trip = mongoose.model('Trips'),
    Application = mongoose.model('Applications'),
    Actor = mongoose.model('Actors'),
    Configuration = mongoose.model('Configuration'),
    Finder = mongoose.model('Finders'),
    Sponsorship = mongoose.model('Sponsorships');

exports.dashboard_info = function (req, res) {
// TODO Generate the different metrics that the requirements doc says about dashboards.

}

exports.cube = function (req, res){

};

exports.cube_explorers = function (req, res){

};

// The average, the minimum, the maximum, and the standard deviation of the number of trips managed per manager
function tripsPerManager(callback){
    Trip.aggregate([
        {
            $group: {
                _id: "$manager",
                tripCount: { $sum: 1 }
            }
        }, {
            $group: {
                _id: null,
                avgManagerTrips: { $avg: "$tripCount" },
                maxManagerTrips: { $max: "$tripCount" },
                minManagerTrips: { $min: "$tripCount" },                
                stdDevManagerTrips: { $stdDevPop: "$tripCount" }
            }
        },{
            $project: {
                _id: 0,
                avgManagerTrips: "$avgManagerTrips",
                maxManagerTrips: "$maxManagerTrips",
                minManagerTrips: "$minManagerTrips",
                stdDevManagerTrips: "$stdDevManagerTrips"
            }
        }
    ], function(err, res){
        callback(err, res[0]);
    });
};

//The average, the minimum, the maximum, and the standard deviation of the number of applications per trip.
function applicationsPerTrip(callback){
    Application.aggregate([
        {
            $group: {
                _id: "$trip",
                tripCount: { $sum: 1 }
            }
        }, {
            $group: {
                _id: null,
                avgTripApplication: { $avg: "$tripCount" },
                maxTripApplication: { $max: "$tripCount" },
                minTripApplication: { $min: "$tripCount" },                
                stdDevTripApplication: { $stdDevPop: "$tripCount" }
            }
        },{
            $project: {
                _id: 0,
                avgTripApplication: "$avgTripApplication",
                maxTripApplication: "$maxTripApplication",
                minTripApplication: "$minTripApplication",
                stdDevTripApplication: "$stdDevTripApplication"
            }
        }
    ], function(err, res){
        callback(err, res[0]);
    });
}

// The average, the minimum, the maximum, and the standard deviation of the price of the trips.
function pricePerTrip(callback){
    Trip.aggregate([
        {
            $group: {
                _id: null,
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" }, 
                stdDevPrice: { $stdDevPop: "$price" }
            }
        }, {
            $project: {
                _id: 0,
                avgPrice: "$avgPrice",
                minPrice: "$minPrice",
                maxPrice: "$maxPrice",
                stdDevPrice: "$stdDevPrice"
            }
        }
    ], function (err, res) {
        callback(err, res[0]);
    });
}