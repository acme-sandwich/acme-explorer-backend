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
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
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
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  Application.find({explorer: authenticatedUserId}, function(err, applications){
    if(err){
      res.send(err);
    }else{
      res.json(applications);
    }
  })
};

exports.create_an_application = function (req, res) {
  var new_application = new Application(req.body);
  console.log(new_application);
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
    if (err) {
      res.send(err);
    }
    else {
      res.json(application);
    }
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
  Application.findOneAndUpdate({ _id: req.params.applicationId }, req.body, { new: true }, function (err, application) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(application);
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
  Application.remove({ _id: req.params.applicationId }, function (err, application) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'Application successfully deleted' });
    }
  });
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