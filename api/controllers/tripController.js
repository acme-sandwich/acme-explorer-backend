'use strict';
/*---------------TRIP----------------------*/
var mongoose = require('mongoose'),
	Trip = mongoose.model('Trips'),
	Application = mongoose.model('Applications');
var authController = require('./authController');

/** Returns all published trips. */
exports.list_all_trips = function (req, res) {
	let published = req.query.published;
	let creator = req.query.creator;
	if(published == null || published === '' || published === '1' || published === 'true'){
		published = true;
	}else{
		published = false;
	}
	let keyword = req.query.keyword;
	let regex = new RegExp(keyword, "i");
	const limit = parseInt(req.query.pageSize, 10) || 10;
	let skip = parseInt(req.query.page, 10) || 0;
	skip = skip * limit;
	const pageOptions = {
		skip: skip,
		limit: limit
	};
	if(creator != null && creator !== ''){
		Trip.find({ 
			creator: creator,
			$or: [{ ticker: regex }, { title: regex }, { description: regex }] 
		}, null, pageOptions, function (err, trips) {
			if (err) {
				res.send(err);
			}
			else {
				res.json(trips);
			}
		});
	}else if(published) {
		Trip.find({ 
			published: true,
			$or: [{ ticker: regex }, { title: regex }, { description: regex }] 
		}, null, pageOptions, function (err, trips) {
			if (err) {
				res.send(err);
			}
			else {
				res.json(trips);
			}
		});
	}else{
		Trip.find({ 
			$or: [{ ticker: regex }, { title: regex }, { description: regex }] 
		}, null, pageOptions, function (err, trips) {
			if (err) {
				res.send(err);
			}
			else {
				res.json(trips);
			}
		});
	}
};

/** Returns all trips created by the user, sorted by creation date.
 *  They can be filtered by published or cancelled **/
exports.list_created_trips = async function (req, res) {
	var idToken = req.headers['idtoken'];
	var authenticatedUserId = await authController.getUserId(idToken);
	var cancelled = req.query.cancelled;
	var published = req.query.published;
	var queryJson = { creator: authenticatedUserId };
	if (cancelled != null) {
		queryJson['cancelled'] = cancelled;
	}
	if (published != null) {
		queryJson['published'] = published;
	}
	Trip.find(queryJson, null, { sort: '-created' }, function (err, trips) {
		if (err) {
			res.send(err);
		}
		else {
			res.json(trips);
		}
	});
};

/** Returns all trips, filtering by keyword,  */
exports.search_from_keyword = function (req, res) {
	var keyword = req.query.keyword;
	var regex = new RegExp(keyword, "i");
	if (keyword) { // Filter by keyword in title, description or ticker.
		Trip.find({
			$or: [{ ticker: regex }, { title: regex }, { description: regex }]
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
		if (err) res.send(err);
		else if (trip == null) res.status(404).send("Trip not found");
		else res.json(trip);
	});
};

exports.update_a_trip = function (req, res) {
	Trip.findById(req.params.tripId, function (err, trip) {
		if (err) res.send(err);
		else if (trip == null) res.status(404).send("Trip not found");
		else {
			Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true }, function (err, trip) {
				if (err) {
					res.send(err);
				}
				else {
					res.json(trip);
				}
			});
		}
	});
};

exports.add_picture_to_trip = function (req, res) {
	const tripId = req.params.tripId;
	const newPhoto = req.body;
	const newPhotoJson = JSON.parse(newPhoto);
	Trip.findById(tripId, function (err, trip) {
		if (err) res.send(err);
		else if (trip == null) res.status(404).send("Trip not found");
		else {
			Trip.findOneAndUpdate({ _id: tripId }, {$push: {photoObject: newPhotoJson}}, { new: true }, function (err, tripUpdated) {
				if (err) {
					res.send(err);
				}
				else {
					res.json(tripUpdated);
				}
			});
		}
	});
}

exports.delete_picture_from_trip = function (req, res) {
	const tripId = req.params.tripId;
	const photoIndex = req.query.photoIndex;
	Trip.findById(tripId, function (err, trip) {
		if (err) res.send(err);
		else if (trip == null) res.status(404).send("Trip not found");
		else {
			let tripPhotos = trip.photoObject;
			tripPhotos.splice(photoIndex, 1); // Eliminamos la imagen de la colección de imágenes a partir de su índice
			trip.photoObject = tripPhotos;
			Trip.findOneAndUpdate({ _id: tripId }, trip, { new: true }, function (err, tripUpdated) {
				if (err) {
					res.send(err);
				}
				else {
					res.json(tripUpdated);
				}
			});
		}
	});
}

exports.update_a_trip_v2 = async function (req, res) {
	Trip.findById(req.params.tripId, async function (err, trip) {
		if (err) {
			res.send(err)
		} else {
			var idToken = req.headers['idtoken'];
			var authenticatedUserId = await authController.getUserId(idToken);
			if (authenticatedUserId == trip.creator) {
				Trip.findOneAndUpdate({ _id: req.params.tripId }, req.body, { new: true }, function (err, trip2) {
					if (err) {
						res.send(err);
					} else {
						res.json(trip2);
					}
				});
			} else {
				res.status(403).send("Only the creator can update trips");
			}
		}
	})
};

exports.delete_a_trip = function (req, res) {
	Trip.findById(req.params.tripId, function (err, trip) {
		if (err) res.send(err);
		else if (trip == null) res.status(404).send("Trip not found");
		else {
			Trip.remove({ _id: req.params.tripId }, function (err, trip) {
				if (err) {
					res.send(err);
				}
				else {
					res.json({ message: 'Trip successfully deleted' });
				}
			});
		}
	});
};

exports.delete_a_trip_v2 = async function (req, res) {
	Trip.findById(req.params.tripId, async function (err, trip) {
		if (err) {
			res.send(err)
		} else {
			var idToken = req.headers['idtoken'];
			var authenticatedUserId = await authController.getUserId(idToken);
			if (authenticatedUserId == trip.creator) {
				Trip.remove({ _id: req.params.tripId }, function (err, trip) {
					if (err) {
						res.send(err);
					}
					else {
						res.json({ message: 'Trip successfully deleted' });
					}
				});
			} else {
				res.status(403).send("Only the creator can update trips");
			}
		}
	})
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

exports.publish_a_trip_v2 = function (req, res) {
	Trip.findById(req.params.tripId, async function (err, trip) {
		if (err) {
			res.send(err);
		}
		else if (trip == null) {
			res.status(404).send('Trip not found');
		}
		else {
			var idToken = req.headers['idtoken'];
			var authenticatedUserId = await authController.getUserId(idToken);
			if (authenticatedUserId != trip.creator) {
				res.status(403).send("Only the creator can publish trips");
			} else if (trip.cancelled) {
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
						var cancelledJson = { 'cancelled': true, 'cancelledReason': req.body.reason };
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

exports.cancel_a_trip_v2 = function (req, res) {
	Trip.findById(req.params.tripId, async function (err, trip) {
		if (err) {
			res.send(err);
		}
		else if (trip == null) {
			res.status(404).send('Trip not found');
		}
		else {
			var idToken = req.headers['idtoken'];
			var authenticatedUserId = await authController.getUserId(idToken);
			if (authenticatedUserId != trip.creator) {
				res.status(403).send("Only the creator can cancel trips");
			}
			else if (trip.cancelled) {
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