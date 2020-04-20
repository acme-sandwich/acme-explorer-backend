'use strict';
/*---------------SPONSORSHIP----------------------*/
var mongoose = require('mongoose'),
  Sponsorship = mongoose.model('Sponsorships'),
  Trip = mongoose.model('Trips');

exports.list_all_sponsorships = function (req, res) {
  Sponsorship.find({}, function (err, sponsorships) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(sponsorships);
    }
  });
};

exports.list_trip_sponsorships = function (req, res) {
  Trip.findById(req.params.tripId, (err, trip) => {
    if (err) {
      res.send(err);
    } else if (trip) {
      Sponsorship.find({trips: req.params.tripId}, function (err, sponsorships) {
        if (err) {
          res.send(err);
        }
        else {
          res.json(sponsorships);
        }
      });
    } else {
      res.status(404).send("Trip not found");
    }
  });
}

exports.list_my_sponsorships = function (req, res) {
  var idSponsor = req.params.actorId;
  Sponsorship.find({sponsor: idSponsor}, function (err, sponsorships) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(sponsorships);
    }
  });
};

exports.create_a_sponsorship = function (req, res) {
  var new_sponsorship = new Sponsorship(req.body);
  new_sponsorship.save(function (err, sponsorship) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(sponsorship);
    }
  });
};

exports.create_a_sponsorship_v2 = async function (req, res) {
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  var new_sponsorship = new Sponsorship(req.body);
  new_sponsorship.sponsor = authenticatedUserId;
  new_sponsorship.save(function (err, sponsorship) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(sponsorship);
    }
  });
};

exports.read_a_sponsorship = function (req, res) {
  Sponsorship.findById(req.params.sponsorshipId, function (err, sponsorship) {
    if (err) {
      res.send(err);
    }
    else if (sponsorship) {
      res.json(sponsorship);
    } else {
      res.status(404).send("Sponsorship not found");
    }
  });
};

exports.read_a_sponsorship_mine = async function (req, res) {
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  Sponsorship.findById(req.params.sponsorshipId, async function (err, sponsorship) {
    if (err) {
      res.send(err);
    } else if(sponsorship.sponsor != authenticatedUserId) res.status(403).send("You dont have permissions to read this sponsorship");
    else {
      res.json(sponsorship);
    }
  });
};

exports.pay_a_sponsorship = function (req, res) {
  Sponsorship.findById(req.params.sponsorshipId, (err, sponsorship) => {
    if (err) {
      res.send(err);
    } else if (sponsorship) {
      Sponsorship.findOneAndUpdate({ _id: req.params.sponsorshipId }, { $set: { "payed": "true" } }, { new: true }, function (err, sponsorship) {
        if (err) {
          res.status(500).send(err);
        }
        else {
          res.json(sponsorship);
        }
      });
    } else {
      res.status(404).send("Sponsorship not found");
    }
  });
};

exports.pay_a_sponsorship_v2 = async function (req, res) {
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  Sponsorship.findById(req.params.sponsorshipId, function(error, spsh){
    if(error) res.send(error);
    else if(spsh == null) res.status(404).send("Sponsorship not found");
    else if(spsh.sponsor != authenticatedUserId) res.status(403).send("You dont have permissions to pay this sponsorship");
    else{
      Sponsorship.findOneAndUpdate({ _id: req.params.sponsorshipId }, { $set: { "payed": "true" } }, { new: true }, function (err, sponsorship) {
        if (err) {
          res.status(500).send(err);
        }
        else {
          res.json(sponsorship);
        }
      });
    }
  }); 
};

exports.pay_a_sponsorship_with_trip = function (req, res) {
  Sponsorship.findById(req.params.sponsorshipId, (err, sponsorship) => {
    if (err) {
      res.send(err);
    } else if (sponsorship) {
      Trip.findById(req.params.tripId, (err, trip) => {
        if (err) {
          res.send(err);
        } else if (trip && !sponsorship.trips.includes(trip._id)) {
          Sponsorship.findOneAndUpdate({ _id: req.params.sponsorshipId }, { $set: { "payed": "true" }, $push: {"trips": trip._id} }, { new: true }, function (err, sponsorship) {
            if (err) {
              res.status(500).send(err);
            }
            else {
              res.json(sponsorship);
            }
          });
        } else if (trip && sponsorship.trips.includes(trip._id)) {
          res.status(409).send("Trip already payed");
        } else {
          res.status(404).send("Trip not found");
        }
      });
    } else {
      res.status(404).send("Sponsorship not found");
    }
  });
};

exports.pay_a_sponsorship_with_trip_v2 = async function (req, res) {
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  Sponsorship.findById(req.params.sponsorshipId, function(error, spsh){
    if(error) res.send(error);
    else if(spsh == null) res.status(404).send("Sponsorship not found");
    else if(spsh.sponsor != authenticatedUserId) res.status(403).send("You dont have permissions to pay this sponsorship");
    else{
      Trip.findById(req.params.tripId, (err, trip) => {
        if (err) {
          res.send(err);
        } else if (trip && !spsh.trips.includes(trip._id)) {
          Sponsorship.findOneAndUpdate({ _id: req.params.sponsorshipId }, { $set: { "payed": "true" }, $push: {"trips": trip._id} }, { new: true }, function (err, sponsorship) {
            if (err) {
              res.status(500).send(err);
            }
            else {
              res.json(sponsorship);
            }
          });
        } else if (trip && spsh.trips.includes(trip._id)) {
          res.status(409).send("Trip already payed");
        } else {
          res.status(404).send("Trip not found");
        }
      });
    }
  }); 
};

exports.update_a_sponsorship = function (req, res) {
  Sponsorship.findById(req.params.sponsorshipId, (err, sponsorship) => {
    if (err) {
      res.send(err);
    } else if (sponsorship) {
      Sponsorship.findOneAndUpdate({ _id: req.params.sponsorshipId }, req.body, { new: true }, function (err, sponsorship) {
        if (err) {
          res.send(err);
        }
        else {
          res.json(sponsorship);
        }
      });
    } else {
      res.status(404).send("Sponsorship not found");
    }
  });
};

exports.update_a_sponsorship_v2 = async function (req, res) {
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  Sponsorship.findById(req.params.sponsorshipId, function (error, sponshp) {
    if (error) res.send(err);
    else if (sponshp == null) res.status(404).send("Sponsorship not found");
    else if (sponshp.sponsor != authenticatedUserId) res.status(401).send("Only the creator can update a sponsorship");
    else {
      Sponsorship.findOneAndUpdate({ _id: req.params.sponsorshipId }, req.body, { new: true }, function (err, sponsorship) {
        if (err) {
          res.send(err);
        }
        else {
          res.json(sponsorship);
        }
      });
    }
  });
};

exports.delete_a_sponsorship = function (req, res) {
  Sponsorship.findById(req.params.sponsorshipId, (err, sponsorship) => {
    if (err) {
      res.send(err);
    } else if (sponsorship) {
      Sponsorship.remove({ _id: req.params.sponsorshipId }, function (err, sponsorship) {
        if (err) {
          res.send(err);
        }
        else {
          res.json({ message: 'Sponsorship successfully deleted' });
        }
      });
    } else {
      res.status(404).send("Sponsorship not found");
    }
  });
};

exports.delete_a_sponsorship_v2 = async function (req, res) {
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  Sponsorship.findById(req.params.sponsorshipId, function (error, sponshp) {
    if (error) res.send(err);
    else if (sponshp == null) res.status(404).send("Sponsorship not found");
    else if (sponshp.sponsor != authenticatedUserId) res.status(401).send("Only the creator can delete a sponsorship");
    else {
      Sponsorship.remove({ _id: req.params.sponsorshipId }, function (err, sponsorship) {
        if (err) {
          res.send(err);
        }
        else {
          res.json({ message: 'Sponsorship successfully deleted' });
        }
      });
    }
  })
};