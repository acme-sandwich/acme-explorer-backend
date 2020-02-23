'use strict';
/*---------------CONFIGURATION----------------------*/
var mongoose = require('mongoose'),
  Configuration = mongoose.model('Configuration');

  exports.list_all_configurations = function (req, res) {
    Configuration.find({}, function (err, configurations) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(configurations);
        }
    });
};

exports.create_a_configuration = function(req, res) {
    var new_configuration = new Configuration(req.body);
    new_configuration.save(function(err, configuration) {
      if (err){
        res.send(err);
      }
      else{
        res.json(configuration);
      }
    });
};

exports.get_current_configuration = function(req, res) {
    Configuration.find({}, function (err, configurations) {
        if (err) {
            res.send(err);
        }
        else {
            var configuration = configurations[0];
            res.json(configuration);
        }
    });
};

exports.update_configuration = function(req, res) {
    Configuration.findOneAndUpdate({_id: req.params.configurationId}, req.body, {new: true}, function(err, configuration) {
      if (err){
        res.send(err);
      }
      else{
        res.json(configuration);
      }
    });
};

exports.delete_a_configuration = function(req, res) {
    Configuration.remove({_id: req.params.configurationId}, function(err, trip) {
        if (err){
            res.send(err);
        }
        else{
            res.json({ message: 'Configuration successfully deleted' });
        }
    });
};