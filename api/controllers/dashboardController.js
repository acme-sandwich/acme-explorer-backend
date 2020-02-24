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
                avgManagerTrips: { $avg: "$countTrips" },
                maxManagerTrips: { $max: "$countTrips" },
                minManagerTrips: { $min: "$countTrips" },                
                stdDevManagerTrips: { $stdDevPop: "$countTrips" }
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