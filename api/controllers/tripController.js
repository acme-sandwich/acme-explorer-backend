'use strict';
/*---------------TRIP----------------------*/
var mongoose = require('mongoose'),
	Trip = mongoose.model('Trips'),
	Application = mongoose.model('Applications');

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

exports.search_from_keyword = function (req, res) {
	var keyword = req.query.keyword;
	if (keyword) { // Filter by keyword in title, description or ticker.
		Trip.find({
			$or: [{ ticker: /keyword/i }, { title: /keyword/i }, { description: /keyword/i }]
		}, function (err, trips) {
			if (err) {
				res.send(err);
			}
			else {
				res.json(trips);
			}
		});
	} else {
		res.status(400).send('Keyword needed');
	}
};

exports.create_a_trip = function (req, res) {
	var new_trip = new Trip(req.body);
	new_trip.save(function (err, trip) {
		if (err) {
			res.send(err);
		}
		else {
			res.json(trip);
		}
	});
};

exports.read_a_trip = function (req, res) {
	Trip.findById(req.params.tripId, function (err, trip) {
		if (err) {
			res.send(err);
		}
		else {
			res.json(trip);
		}
	});
};

exports.update_a_trip = function (req, res) {
	Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true }, function (err, trip) {
		if (err) {
			res.send(err);
		}
		else {
			res.json(trip);
		}
	});
};

exports.delete_a_trip = function (req, res) {
	Trip.remove({ _id: req.params.tripId }, function (err, trip) {
		if (err) {
			res.send(err);
		}
		else {
			res.json({ message: 'Trip successfully deleted' });
		}
	});
};

exports.publish_a_trip = function (req, res) {
	Trip.findById(req.params.tripId, function (err, trip) {
		if (err) {
			res.send(err);
		}
		else if (trip == null) {
			res.status(404).send('Trip not found');
		}
		else {
			if (trip.cancelled) {
				res.status(409).send('Cannot publish a cancelled trip');
			} else if (trip.published) {
				res.status(409).send('Trip is already published');
			} else {
				var publishedJson = { 'published': true };
				Trip.findOneAndUpdate({ _id: req.params.tripId }, publishedJson, { new: true }, function (err, trip) {
					if (err) {
						res.send(err);
					}
					else {
						res.json(trip);
					}
				});
			}
		}
	});
};

exports.cancel_a_trip = function (req, res) {
	Trip.findById(req.params.tripId, function (err, trip) {
		if (err) {
			res.send(err);
		}
		else if (trip == null) {
			res.status(404).send('Trip not found');
		}
		else {
			if (trip.cancelled) {
				res.status(409).send('Trip is already cancelled');
			} else if (!trip.published) {
				res.status(409).send('Cannot cancel a not published trip');
			} else if (trip.startDate < new Date()) {
				res.status(409).send('Cannot cancel a trip that has started');
			} else {
				Application.find({
					trip: trip._id, status: "ACCEPTED"
				}, function (err, applications) {
					if (err) {
						res.send(err);
					}
					else if (applications.length > 0) {
						res.status(409).send('Cannot cancel a trip that has accepted applications');
					} else {
						var cancelledJson = { 'cancelled': true, 'reason': req.body.reason };
						Trip.findOneAndUpdate({ _id: req.params.tripId }, cancelledJson, { new: true }, function (err, trip) {
							if (err) {
								res.send(err);
							}
							else {
								res.json(trip);
							}
						});
					}
				});
			}
		}
	});
};