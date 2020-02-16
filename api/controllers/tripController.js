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

exports.create_a_trip = function(req, res) {
    var new_trip = new Trip(req.body);
    new_trip.save(function(err, trip) {
      if (err){
        res.send(err);
      }
      else{
        res.json(trip);
      }
    });
};

exports.read_a_trip = function(req, res) {
    Trip.findById(req.params.tripId, function(err, trip) {
      if (err){
        res.send(err);
      }
      else{
        res.json(trip);
      }
    });
};

exports.update_a_trip = function(req, res) {
    Trip.findOneAndUpdate({_id: req.params.tripId}, req.body, {new: true}, function(err, trip) {
      if (err){
        res.send(err);
      }
      else{
        res.json(trip);
      }
    });
};

exports.delete_a_trip = function(req, res) {
    Trip.remove({_id: req.params.tripId}, function(err, trip) {
        if (err){
            res.send(err);
        }
        else{
            res.json({ message: 'Trip successfully deleted' });
        }
    });
};