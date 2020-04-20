'use strict';
/*---------------APPLICATION----------------------*/
var mongoose = require('mongoose'),
  Application = mongoose.model('Applications'),
  Trip = mongoose.model('Trips');

exports.list_all_applications = function (req, res) {
  Application.find({}, function (err, applications) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(applications);
    }
  });
};

exports.list_all_applications_v2 = async function (req, res) {
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  Trip.findById(req.params.tripId, function(err, trip){
    if(err){
      res.send(err);
    }else if(authenticatedUserId != trip.creator){
      res.status(401).send("You must be the trip creator");
    }else{
      Application.find({trip: req.params.tripId}, function (err, applications) {
        if (err) {
          res.send(err);
        }
        else {
          res.json(applications);
        }
      });
    }
  });
};

exports.list_all_applications_all_trips = async function (req, res) {
  /*var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);*/
  var authenticatedUserId = req.query.manager;
  Trip.find({ creator: authenticatedUserId }, function (error, trips) {
    var tripsIds = [];
    for (var i = 0; i < trips.length; i++) {
      tripsIds.push(trips[i]._id);
    }
    Application.find({ _id: { $in: tripsIds } }, function (err, applications) {
      if (err) {
        res.send(err);
      }
      else {
        res.json(applications);
      }
    });
  });
};

exports.list_my_applications = async function (req, res) {
  /*var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);*/
  var explorer = req.query.explorer;
  var manager = req.query.manager;
  if(explorer != null && explorer !== ''){
    Application.find({explorer: explorer}, function(err, applications){
      if(err){
        res.send(err);
      }else{
        res.json(applications);
      }
    })
  }else{
    Application.find({manager: manager}, function(err, applications){
      if(err){
        res.send(err);
      }else{
        res.json(applications);
      }
    })
  }
};

exports.create_an_application = function (req, res) {
  var new_application = new Application(req.body);
  new_application.save(function (err, application) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(application);
    }
  });
};

exports.read_an_application = function (req, res) {
  Application.findById(req.params.applicationId, function (err, application) {
    if (err) res.send(err);
    else if(application == null) res.status(404).send("Application not found");
    else res.json(application);
  });
};

exports.read_an_application_v2 = async function (req, res) {
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  Application.findById(req.params.applicationId, function (err, application) {
    if (err) {
      res.send(err);
    } else if(application.explorer == authenticatedUserId) {
      res.send(application);
    }else{
      Trip.find({creator: authenticatedUserId}, function(error, trips){
        if(err){
          res.send(err);
        }else if (trips == null || trips.length == 0){
          res.status(404).send("User cannot read application");
        }else{
          res.send(application);
        }
      })
    }
  });
};

exports.update_an_application = function (req, res) {
  Application.findById(req.params.applicationId, function(err, app){
    if(err) res.send(err);
    else if(app == null) res.status(404).send("Application not found");
    else{
      Application.findOneAndUpdate({ _id: req.params.applicationId }, req.body, { new: true }, function (err, application) {
        if (err) {
          res.send(err);
        }
        else {
          res.json(application);
        }
      });
    }
  });
};

exports.update_an_application_v2 = async function (req, res) {
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  Application.findById(req.params.applicationId, function (err, application) {
    if (err) {
      res.send(err);
    } else if(application.explorer == authenticatedUserId) {
      Application.findOneAndUpdate({ _id: req.params.applicationId }, req.body, { new: true }, function (err, application) {
        if (err) {
          res.send(err);
        }
        else {
          res.json(application);
        }
      });
    }else{
      Trip.find({creator: authenticatedUserId}, function(error, trips){
        if(err){
          res.send(err);
        }else if (trips == null || trips.length == 0){
          res.status(404).send("User cannot read application");
        }else{
          Application.findOneAndUpdate({ _id: req.params.applicationId }, req.body, { new: true }, function (err, application) {
            if (err) {
              res.send(err);
            }
            else {
              res.json(application);
            }
          });
        }
      })
    }
  });
};

exports.delete_an_application = function (req, res) {
  Application.findById(req.params.applicationId, function(err, app){
    if(err) res.send(err);
    else if(app == null) res.status(404).send("Application not found");
    else{
      Application.remove({ _id: req.params.applicationId }, function (err, application) {
        if (err) {
          res.send(err);
        }
        else {
          res.json({ message: 'Application successfully deleted' });
        }
      });
    }
  })
};

exports.delete_an_application_v2 = async function (req, res) {
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  Application.findById(req.params.applicationId, function (err, application) {
    if (err) {
      res.send(err);
    } else if(application.explorer == authenticatedUserId) {
      Application.remove({ _id: req.params.applicationId }, function (err, application) {
        if (err) {
          res.send(err);
        }
        else {
          res.json({ message: 'Application successfully deleted' });
        }
      });
    }else{
      Trip.find({creator: authenticatedUserId}, function(error, trips){
        if(err){
          res.send(err);
        }else if (trips == null || trips.length == 0){
          res.status(404).send("User cannot read application");
        }else{
          Application.remove({ _id: req.params.applicationId }, function (err, application) {
            if (err) {
              res.send(err);
            }
            else {
              res.json({ message: 'Application successfully deleted' });
            }
          });
        }
      })
    }
  });
};

exports.cancel_an_application = function (req, res) {
  Application.findById(req.params.applicationId, function(err, application){
    if (err) {
      res.send(err);
    } else if (application == null){
      res.status(404).send('Application not found');
    } else {
      Application.findOneAndUpdate({ _id: req.params.applicationId }, { $set: { "status": "CANCELLED" } }, { new: true }, function (err, actor) {
        if (err) {
          res.send(err);
        } else {
          res.json({ message: 'Application has been cancelled successfully' });
        }
      });
    }
  });
}

exports.cancel_an_application_v2 = async function (req, res) {
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
    Application.findById(req.params.applicationId, function(err, application){
      if (err) {
        res.send(err);
      } else if (application == null){
        res.status(404).send('Application not found');
      } else if (application.status == 'PENDING' || application.status == 'ACCEPTED') {
			  if(authenticatedUserId != application.trip.creator){
				  res.status(403).send("Only the trip creator can modify applications");
			  } else {
          Application.findOneAndUpdate({ _id: req.params.applicationId }, { $set: { "status": "CANCELLED" } }, { new: true }, function (err, actor) {
            if (err) {
              res.send(err);
            } else {
              res.json({ message: 'Application has been cancelled successfully' });
            }
          });
        }
      }
    });
}

exports.reject_an_application = function (req, res) {
  Application.findById(req.params.applicationId, function(err, application){
    if (err) {
      res.send(err);
    } else if (application == null){
      res.status(404).send('Application not found');
    } else if (application.status == 'PENDING') {
        Application.findOneAndUpdate({ _id: req.params.applicationId }, { $set: { "status": "REJECTED" } }, { new: true }, function (err, actor) {
          if (err) {
            res.send(err);
          } else {
            res.json({ message: 'Application has been rejected successfully' });
          }
        });
    }
  });
}

exports.reject_an_application_v2 = async function (req, res) {
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  Application.findById(req.params.applicationId, function(err, application){
    if (err) {
      res.send(err);
    } else if (application == null){
      res.status(404).send('Application not found');
    } else if (application.status == 'PENDING') {
      if(authenticatedUserId != application.trip.creator){
        res.status(403).send("Only the trip creator can modify applications");
      } else {
        Application.findOneAndUpdate({ _id: req.params.applicationId }, { $set: { "status": "REJECTED" } }, { new: true }, function (err, actor) {
          if (err) {
            res.send(err);
          } else {
            res.json({ message: 'Application has been rejected successfully' });
          }
        });
      }
    }
  });
}

exports.due_an_application = function (req, res) {
  Application.findById(req.params.applicationId, function(err, application){
    if (err) {
      res.send(err);
    } else if (application == null){
      res.status(404).send('Application not found');
    } else if (application.status == 'PENDING'){
        Application.findOneAndUpdate({ _id: req.params.applicationId }, { $set: { "status": "DUE" } }, { new: true }, function (err, actor) {
          if (err) {
            res.send(err);
          } else {
            res.json({ message: 'Application has been due successfully' });
          }
        });
      }
  });
}

exports.due_an_application_v2 = async function (req, res) {
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  Application.findById(req.params.applicationId, function(err, application){
    if (err) {
      res.send(err);
    } else if (application == null){
      res.status(404).send('Application not found');
    } else if (application.status == 'PENDING'){
      if(authenticatedUserId != application.trip.creator){
        res.status(403).send("Only the trip creator can modify applications");
      } else {
        Application.findOneAndUpdate({ _id: req.params.applicationId }, { $set: { "status": "DUE" } }, { new: true }, function (err, actor) {
          if (err) {
            res.send(err);
          } else {
            res.json({ message: 'Application has been due successfully' });
          }
        });
      }
    }
  });
}