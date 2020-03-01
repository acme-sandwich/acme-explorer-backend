'use strict';
/*---------------DATAWAREHOUSE----------------------*/
var async = require("async");
var mongoose = require('mongoose');
var DataWareHouse = mongoose.model('DataWareHouse');
var Cube = mongoose.model('Cube');
var Trip = mongoose.model('Trips');
var Application = mongoose.model('Applications');
var Actor = mongoose.model('Actors');
var Configuration = mongoose.model('Configuration');
var Finder = mongoose.model('Finders');
var Sponsorship = mongoose.model('Sponsorships');

exports.list_all_indicators = function (req, res) {
    // TODO Generate the different metrics that the requirements doc says about dashboards.
    console.log('Requesting indicators');
    DataWareHouse.find().sort("-computationMoment").exec(function (err, indicators) {
        if (err) {
            res.send(err);
        } else {
            res.json(indicators);
        }
    });

}

exports.last_indicator = function (req, res) {
    DataWareHouse.find().sort("-computationMoment").limit(1).exec(function (err, indicators) {
        if (err) {
            res.send(err);
        } else {
            res.json(indicators);
        }
    })
}

var CronJob = require('cron').CronJob;
var CronTime = require('cron').CronTime;

//'0 0 * * * *' una hora
//'*/30 * * * * *' cada 30 segundos
//'*/10 * * * * *' cada 10 segundos
//'* * * * * *' cada segundo
var rebuildPeriod = '*/10 * * * * *';  //Este es cada 10 segundos, por motivos de prueba
var computeDataWareHouseJob;

exports.rebuildPeriod = function (req, res) {
    console.log('Updating rebuild period. Request: period:' + req.query.rebuildPeriod);
    rebuildPeriod = req.query.rebuildPeriod;
    computeDataWareHouseJob.setTime(new CronTime(rebuildPeriod));
    computeDataWareHouseJob.start();

    res.json(req.query.rebuildPeriod);
}

function createDataWareHouseJob() {
    computeDataWareHouseJob = new CronJob(rebuildPeriod, function () {
        var new_dataWareHouse = new DataWareHouse();
        console.log('Cron job submitted. Rebuild period: ' + rebuildPeriod);
        async.parallel([
            tripsPerManager,
            applicationsPerTrip,
            pricePerTrip,
            ratioApplicationsByStatus,
            averageFindersPrice,
            topFindersKeywords
        ], function (err, results) {
            if (err) {
                console.log("Error computing datawarehouse: " + err);
            } else {
                new_dataWareHouse.tripsPerManagers = results[0];
                new_dataWareHouse.applicationsPerTrip = results[1];
                new_dataWareHouse.pricePerTrip = results[2];
                new_dataWareHouse.ratioApplicationsPerStatus = results[3];
                new_dataWareHouse.avgFinderPrices = results[4];
                new_dataWareHouse.topFinderKeyWords = results[5];

                new_dataWareHouse.save(function (err, datawarehouse) {
                    if (err) {
                        console.log("Error saving datawarehouse:  " + err);
                    } else {
                        console.log("new DataWareHouse succesfully saved. Date: " + new Date());
                    }
                });
            }
        });
    }, null, true, 'Europe/Madrid');
}

module.exports.createDataWareHouseJob = createDataWareHouseJob;

// The average, the minimum, the maximum, and the standard deviation of the number of trips managed per manager
function tripsPerManager(callback) {
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
        }, {
            $project: {
                _id: 0,
                avgManagerTrips: "$avgManagerTrips",
                maxManagerTrips: "$maxManagerTrips",
                minManagerTrips: "$minManagerTrips",
                stdDevManagerTrips: "$stdDevManagerTrips"
            }
        }
    ], function (err, res) {
        callback(err, res[0]);
    });
};

//The average, the minimum, the maximum, and the standard deviation of the number of applications per trip.
function applicationsPerTrip(callback) {
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
        }, {
            $project: {
                _id: 0,
                avgTripApplication: "$avgTripApplication",
                maxTripApplication: "$maxTripApplication",
                minTripApplication: "$minTripApplication",
                stdDevTripApplication: "$stdDevTripApplication"
            }
        }
    ], function (err, res) {
        callback(err, res[0]);
    });
}

// The average, the minimum, the maximum, and the standard deviation of the price of the trips.
function pricePerTrip(callback) {
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

function ratioApplicationsByStatus(callback) {
    // The ratio of applications grouped by status
    Application.aggregate([
        {
            $facet: {
                totalApplications: [{ $group: { _id: null, totalApplications: { "$sum": 1 } } }],
                pendingApplications: [
                    { $match: { status: "PENDING" } },
                    { $group: { _id: null, totalApplications: { "$sum": 1 } } }
                ],
                rejectedApplications: [
                    { $match: { status: "REJECTED" } },
                    { $group: { _id: null, totalApplications: { "$sum": 1 } } }
                ],
                dueApplications: [
                    { $match: { status: "DUE" } },
                    { $group: { _id: null, totalApplications: { "$sum": 1 } } }
                ],
                acceptedApplications: [
                    { $match: { status: "ACCEPTED" } },
                    { $group: { _id: null, totalApplications: { "$sum": 1 } } }
                ],
                cancelledApplications: [
                    { $match: { status: "CANCELLED" } },
                    { $group: { _id: null, totalApplications: { "$sum": 1 } } }
                ]
            }
        },
        {
            $project: {
                _id: 0,
                ratioPendingApplications: { $divide: [{ $arrayElemAt: ["$pendingApplications.totalApplications", 0] }, { $arrayElemAt: ["$totalApplications.totalApplications", 0] }] },
                ratioRejectedApplications: { $divide: [{ $arrayElemAt: ["$rejectedApplications.totalApplications", 0] }, { $arrayElemAt: ["$totalApplications.totalApplications", 0] }] },
                ratioDueApplications: { $divide: [{ $arrayElemAt: ["$dueApplications.totalApplications", 0] }, { $arrayElemAt: ["$totalApplications.totalApplications", 0] }] },
                ratioAcceptedApplications: { $divide: [{ $arrayElemAt: ["$acceptedApplications.totalApplications", 0] }, { $arrayElemAt: ["$totalApplications.totalApplications", 0] }] },
                ratioCancelledApplications: { $divide: [{ $arrayElemAt: ["$cancelledApplications.totalApplications", 0] }, { $arrayElemAt: ["$totalApplications.totalApplications", 0] }] }

            }
        },
        {
            $project: {
                ratioPendingApplications: {
                    $cond: {
                        if: { $eq: [null, "$ratioPendingApplications"] },
                        then: 0,
                        else: "$ratioPendingApplications"
                    }
                },
                ratioRejectedApplications: {
                    $cond: {
                        if: { $eq: [null, "$ratioRejectedApplications"] },
                        then: 0,
                        else: "$ratioRejectedApplications"
                    }
                },
                ratioDueApplications: {
                    $cond: {
                        if: { $eq: [null, "$ratioDueApplications"] },
                        then: 0,
                        else: "$ratioDueApplications"
                    }
                },
                ratioAcceptedApplications: {
                    $cond: {
                        if: { $eq: [null, "$ratioAcceptedApplications"] },
                        then: 0,
                        else: "$ratioAcceptedApplications"
                    }
                },
                ratioCancelledApplications: {
                    $cond: {
                        if: { $eq: [null, "$ratioCancelledApplications"] },
                        then: 0,
                        else: "$ratioCancelledApplications"
                    }
                }
            }
        }
    ], function (err, res) {
        callback(err, res[0]);
    });
};

function averageFindersPrice(callback) {
    Finder.aggregate([
        {
            $group: {
                _id: null,
                avgMinPrice: { $avg: "$minPrice" },
                avgMaxPrice: { $min: "$maxPrice" }
            }
        }, {
            $project: {
                _id: 0,
                avgMinPrice: "$avgMinPrice",
                avgMaxPrice: "$avgMaxPrice"
            }
        }
    ], function (err, res) {
        callback(err, res[0]);
    });
}

function topFindersKeywords(callback) {
    Finder.aggregate([
        {
            $match: {
                keyWord: { $ne: null }
            }
        },
        {
            $facet: {
                preComputation: [
                    {
                        $group: {
                            _id: null,
                            numKeywords: { $sum: 1 }
                        }
                    },
                    {
                        $project:
                        {
                            _id: 0,
                            limitTopPercentage: {
                                $ceil: {
                                    $multiply: ["$numKeywords", 0.1]
                                }
                            }
                        }
                    }
                ],
                keywords: [{
                    $group: {
                        _id: "$keyWord",
                        keywordSum: {
                            $sum: 1
                        }
                    }
                }, {
                    $project: {
                        _id: 0,
                        keyword: "$_id",
                        keywordSum: 1
                    }
                }, {
                    $sort: { "keywordSum": -1 }
                }]
            }
        },
        {
            $project: {
                topKeywords:
                {
                    $slice: ["$keywords",
                        {
                            $arrayElemAt: ["$preComputation.limitTopPercentage", 0]
                        }]
                }
            }
        }]
        , function (err, res) {
            var arrayResultado = [];
            if (res[0].topKeywords != null) {
                var keywords = res[0].topKeywords;               
                for (var i = 0; i < keywords.length; i++) {
                    if (keywords[i].keyword != null)
                        arrayResultado.push(keywords[i]);
                }
            }
            callback(err, arrayResultado);
        });
}

// This function receives a string of the form "M01",..., "M36" or "Y01",..., "Y03" and returns a Javascript
// Date object that equals today's date MINUS the number or months or years specified in the parameter.
function getStartDateFromPeriod(periodString) {
    try {
        var upperCasePeriodString = (periodString + "").toUpperCase();
        var digitsPeriod = Number(upperCasePeriodString.substring(1, 3));
        var today = new Date();
        var startPeriodDate = new Date();

        if (upperCasePeriodString.startsWith("M")) {
            if (digitsPeriod < 1 || digitsPeriod > 36) {
                return { error: "Months must be between 01 and 36" };
            } else {
                startPeriodDate.setMonth(startPeriodDate.getMonth() - digitsPeriod);
            }
        } else if (upperCasePeriodString.startsWith("Y")) {
            if (digitsPeriod < 1 || digitsPeriod > 3) {
                return { error: "Years must be between 01 and 03" };
            } else {
                startPeriodDate.setFullYear(startPeriodDate.getFullYear() - digitsPeriod);
            }
        } else {
            return { error: "Period string is wrongly formed. Must be M01 - M36 or Y01 - Y03" };
        }
        return { today: today, startPeriodDate: startPeriodDate };
    } catch (error) {
        return { error: "Period string is wrongly formed. Must be M01 - M36 or Y01 - Y03" };
    }
}

// Returns the amount of money that explorer e has spent on trips during period p, which can be M01-M36 to 
// denote any of the last 1-36 months or Y01-Y03 to denote any of the last three years
exports.cube = function (req, res) {
    // Tengo que recorrer Applications y filtrar para que la fecha esté dentro del periodo,
    // el explorer sea el explorer en cuestión y el status esté a ACCEPTED. Obtengo los trips.
    // Una vez tengo los trips correspondientes, recorro Trip filtrando por id y calculando la suma total
    // de los precios.
    var explorerId = req.body.explorer;
    var periodRange = req.body.period;
    var datesPeriod = getStartDateFromPeriod(periodRange);
    if (datesPeriod.error) {
        res.status(400).send(datesPeriod.error);
    } else {
        var maxDateRange = datesPeriod.today; // Will always be today's date
        var minDateRange = datesPeriod.startPeriodDate;

        var trips = Application.aggregate([
            {
                $match: {
                    explorer: explorerId,
                    status: "ACCEPTED",
                    updateMoment: {
                        $gte: minDateRange,
                        $lte: maxDateRange
                    }
                }
            }, {
                $project: {
                    _id: 0,
                    trips: "$trip"
                }
            }
        ], function (err, res) {
            res(res[0]);
        });


    }
};

exports.cube_explorers = function (req, res) {
    // TODO
};
