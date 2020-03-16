'use strict';
/*---------------ACTOR----------------------*/
var mongoose = require('mongoose');
var Actor = mongoose.model('Actors');
var admin = require('firebase-admin');
var authController = require('./authController');

exports.list_all_actors = function (req, res) {
  Actor.find({}, function (err, actors) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(actors);
    }
  });
};

exports.create_an_actor = function (req, res) {
  var new_actor = new Actor(req.body);
  console.log(new_actor);
  new_actor.save(function (err, actor) {
    if (err) {
      res.status(400).send(err);
      console.log(err);
    }
    else {
      res.json(actor);
    }
  });
};

exports.create_a_manager = function (req, res) {
  var new_actor = new Actor(req.body);
  if(! new_actor.status.includes("MANAGER")) res.status(400).send("Actor must be manager");
  else{
    new_actor.save(function (err, actor) {
      if (err) {
        res.status(400).send(err);
        console.log(err);
      }
      else {
        res.json(actor);
      }
    });
  }
};

exports.create_an_admin = function (req, res) {
  var new_actor = new Actor(req.body);
  if(! new_actor.status.includes("ADMINISTRATOR")) res.status(400).send("Actor must be administrator");
  else{
    new_actor.save(function (err, actor) {
      if (err) {
        res.status(400).send(err);
        console.log(err);
      }
      else {
        res.json(actor);
      }
    });
  }
};

exports.read_an_actor = function (req, res) {
  Actor.findById(req.params.actorId, function (err, actor) {
    if (err) {
      res.send(err);
    }
    else if (actor == null) {
      res.status(404).send("Actor not found");
    } else {
      res.json(actor);
    }
  });
};

exports.update_an_actor = function (req, res) {
  Actor.findById(req.params.actorId, function (err, trip) {
    if (err) {
      res.send(err);
    } else if (trip == null) {
      res.status(404).send("Actor not found");
    } else {
      Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
        if (err) {
          res.send(err);
        } else {
          res.json(actor);
        }
      });
    }
  });
};

exports.delete_an_actor = function (req, res) {
  Actor.remove({ _id: req.params.actorId }, function (err, actor) {
    if (err) {
      res.send(err);
    }
    else {
      res.json({ message: 'Actor successfully deleted' });
    }
  });
};

exports.delete_an_actor_v2 = async function (req, res) {
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  Actor.findById(req.params.actorId, function(error, actor){
    if(error) res.send(error);
    else if(actor == null) res.status(404).send("Actor not found");
    else if(actor._id != authenticatedUserId) res.status(401).send("Only the actor can delete himself");
    else{
      Actor.remove({ _id: req.params.actorId }, function (err, actor) {
        if (err) {
          res.send(err);
        }
        else {
          res.json({ message: 'Actor successfully deleted' });
        }
      });
    }
  })
};

exports.login_an_actor = async function (req, res) {
  console.log('starting login an actor');
  var emailParam = req.query.email;
  var password = req.query.password;
  Actor.findOne({ email: emailParam }, function (err, actor) {
    if (err) { res.send(err); }

    // No actor found with that email as username
    else if (!actor) {
      res.status(401); //an access token isn’t provided, or is invalid
      res.json({ message: 'forbidden', error: err });
    }

    else if (actor.banned == true) {
      res.status(403); //an access token is valid, but requires more privileges
      res.json({ message: 'forbidden', error: err });
    }
    else {
      // Make sure the password is correct
      actor.verifyPassword(password, async function (err, isMatch) {
        if (err) {
          res.send(err);
        }

        // Password did not match
        else if (!isMatch) {
          //res.send(err);
          res.status(401); //an access token isn’t provided, or is invalid
          res.json({ message: 'forbidden', error: err });
        }

        else {
          try {
            var customToken = await admin.auth().createCustomToken(actor.email);
          } catch (error) {
            console.log("Error creating custom token:", error);
          }
          actor.customToken = customToken;
          console.log('Login Success... sending JSON with custom token');
          res.json(actor);
        }
      });
    }
  });
};

exports.update_a_verified_actor = function (req, res) {
  //An actor can only update 
  console.log('Starting to update the actor...');
  Actor.findById(req.params.actorId, async function (err, actor) {
    if (err) {
      res.send(err);
    }
    else {
      console.log('actor: ' + actor);
      var idToken = req.headers['idtoken'];//WE NEED the FireBase custom token in the req.header['idToken']... it is created by FireBase!!
      var authenticatedUserId = await authController.getUserId(idToken);
      if (authenticatedUserId == req.params.actorId) {
        Actor.findOneAndUpdate({ _id: req.params.actorId }, req.body, { new: true }, function (err, actor) {
          if (err) {
            res.send(err);
          }
          else {
            console.log("todo OK");
            res.json(actor);
            console.log("todo OK");
          }
        });
      } else {
        res.status(403); //Auth error
        res.send('The Actor is trying to update an Actor that is not himself!');
      }
    }
  });

};

exports.ban_an_actor = function (req, res) {
  Actor.findOneAndUpdate({ _id: req.params.actorId }, { $set: { "banned": "true" } }, { new: true }, function (err, actor) {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: 'Actor has been banned successfully' });
    }
  });
};

exports.unban_an_actor = function (req, res) {
  Actor.findOneAndUpdate({ _id: req.params.actorId }, { $set: { "banned": "false" } }, { new: true }, function (err, actor) {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: 'Actor has been unbanned successfully' });
    }
  });
}
