'use strict';
/*---------------TRIP----------------------*/
var mongoose = require('mongoose'),
  Trip = mongoose.model('Trips');

exports.list_all_trips = function (req, res) {
    Trip.find({}, function (err, trips) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(trips);
        }
    });
};