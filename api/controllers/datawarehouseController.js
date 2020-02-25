'use strict';
/*---------------DATAWAREHOUSE----------------------*/
var mongoose = require('mongoose'),
	Trip = mongoose.model('Trips'),
    Application = mongoose.model('Applications'),
    Actor = mongoose.model('Actors'),
    Configuration = mongoose.model('Configuration'),
    Finder = mongoose.model('Finders'),
    Sponsorship = mongoose.model('Sponsorships');

exports.datawarehouse_info = function (req, res) {
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

// The ratio of applications grouped by status
function.applicationsByStatus(callback){
    Application.aggregate([
        {
            $facet: {
                totalApplications: [{ $group: {_id: null, totalApplications: {"$sum": 1}}}],
                pendingApplications: [
                    {$match: {status: "PENDING"}},
                    {$group: {_id: null, totalApplications: {"$sum": 1}}}
                ],
                rejectedApplications: [
                    {$match: {status: "REJECTED"}},
                    {$group: {_id: null, totalApplications: {"$sum": 1}}}
                ],
                dueApplications: [
                    {$match: {status: "DUE"}},
                    {$group: {_id: null, totalApplications: {"$sum": 1}}}
                ],
                acceptedApplications: [
                    {$match: {status: "ACCEPTED"}},
                    {$group: {_id: null, totalApplications: {"$sum": 1}}}
                ],
                cancelledApplications: [
                    {$match: {status: "CANCELLED"}},
                    {$group: {_id: null, totalApplications: {"$sum": 1}}}
                ]
            }
        },
        {
            $project: {
                _id: 0,
                ratioPendingApplications: {$divide: [{$arrayElemAt: ["$pendingApplications.totalApplications", 0]}, {$arrayElemAt: ["$totalApplications.totalApplications", 0]}]},
                ratioRejectedApplications: {$divide: [{$arrayElemAt: ["$rejectedApplications.totalApplications", 0]}, {$arrayElemAt: ["$totalApplications.totalApplications", 0]}]},
                ratioDueApplications: {$divide: [{$arrayElemAt: ["$dueApplications.totalApplications", 0]}, {$arrayElemAt: ["$totalApplications.totalApplications", 0]}]},
                ratioAcceptedApplications: {$divide: [{$arrayElemAt: ["$acceptedApplications.totalApplications", 0]}, {$arrayElemAt: ["$totalApplications.totalApplications", 0]}]},
                ratioCancelledApplications: {$divide: [{$arrayElemAt: ["$cancelledApplications.totalApplications", 0]}, {$arrayElemAt: ["$totalApplications.totalApplications", 0]}]}

            }
        },
        {
            $project: {
                ratioPendingApplications: {
                    $cond: {
                        if: {$eq: [null, "$ratioPendingApplications"]},
                        then: 0,
                        else: "$ratioPendingApplications"
                    }
                },
                ratioRejectedApplications: {
                    $cond: {
                        if: {$eq: [null, "$ratioRejectedApplications"]},
                        then: 0,
                        else: "$ratioRejectedApplications"
                    }
                },
                ratioDueApplications: {
                    $cond: {
                        if: {$eq: [null, "$ratioDueApplications"]},
                        then: 0,
                        else: "$ratioDueApplications"
                    }
                },
                ratioAcceptedApplications: {
                    $cond: {
                        if: {$eq: [null, "$ratioAcceptedApplications"]},
                        then: 0,
                        else: "$ratioAcceptedApplications"
                    }
                },
                ratioCancelledApplications: {
                    $cond: {
                        if: {$eq: [null, "$ratioCancelledApplications"]},
                        then: 0,
                        else: "$ratioCancelledApplications"
                    }
                }
            }
        }
    ], function(err, res) {
        callback(err, res[0]);
    });
};