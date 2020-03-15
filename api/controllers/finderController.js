'use strict';
/*---------------FINDER----------------------*/
var mongoose = require('mongoose'),
  Finder = mongoose.model('Finders'),
  Trip = mongoose.model('Trips'),
  Configurations = mongoose.model('Configuration');

exports.list_all_finders = function(req, res) {
    Finder.find({}, function(err, finders) {
        if (err){
          res.send(err);
        }
        else{
            res.json(finders);
        }
    });
};

exports.create_a_finder = function(req, res) {
  var new_finder = new Finder(req.body);
  if (new_finder.explorer == null) res.status(400).send('Explorer not included');
  else {
    Finder.findOne({ explorer: new_finder.explorer }, (err, foundFinder) => {
      if (err) {
        res.send(err);
      } else if (foundFinder) {
        res.status(400).send('Explorer already has a finder');
      } else {
        var query = {};
        if (new_finder.keyWord != null) {
          var regex = new RegExp(new_finder.keyWord, 'i');
          query['$or'] = [{ ticker: regex }, { title: regex }, { description: regex }];
        }
        if (new_finder.minPrice != null && new_finder.maxPrice == null) query['price'] = {'$gte': new_finder.minPrice};
        if (new_finder.maxPrice != null && new_finder.minPrice == null) query['price'] = {'$lte': new_finder.maxPrice};
        if (new_finder.minPrice != null && new_finder.maxPrice != null) query['price'] = {'$gte': new_finder.minPrice, '$lte': new_finder.maxPrice};
        if (new_finder.dateStart != null && new_finder.dateEnd == null) query['startDate'] = {'$gte': new_finder.dateStart};
        if (new_finder.dateEnd != null && new_finder.dateStart == null) query['startDate'] = {'$lte': new_finder.dateEnd};
        if (new_finder.dateStart != null && new_finder.dateEnd != null) query['startDate'] = {'$gte': new_finder.dateStart, '$lte': new_finder.dateEnd};
        Configurations.find({}, (err, configs) => {
          if (err) {
            res.send(err);
          } else if (configs.length == 0) {
            res.status(500).send('Configuration not defined');
          } else {
            var maxTrips = configs[0].resultsNumberFinder;
            Trip.find(query).limit(maxTrips).exec((err, trips) => {
              new_finder['trips'] = trips;
              new_finder.save(function(err, finder) {
                if (err){
                  res.send(err);
                }
                else{
                  res.json(finder);
                }
              });
            });
          }
        });
      }
    });
  }
};

exports.read_a_finder = function(req, res) {
  Finder.findById(req.params.finderId, function(err, finder) {
    if (err){
      res.send(err);
    }
    else{
      res.json(finder);
    }
  });
};

exports.update_a_finder = function(req, res) {
  if (req.body.explorer == null) res.status(400).send('Explorer not included');
  else {
    Finder.findById(req.params.finderId, function(err, finder) {
      if (err) {
        res.send(err);
      } else {
        var query = {};
        if (req.body.keyWord != null) {
          var regex = new RegExp(req.body.keyWord, 'i');
          query['$or'] = [{ ticker: regex }, { title: regex }, { description: regex }];
        }
        if (req.body.minPrice != null && req.body.maxPrice == null) query['price'] = {'$gte': req.body.minPrice};
        if (req.body.maxPrice != null && req.body.minPrice == null) query['price'] = {'$lte': req.body.maxPrice};
        if (req.body.minPrice != null && req.body.maxPrice != null) query['price'] = {'$gte': req.body.minPrice, '$lte': req.body.maxPrice};
        if (req.body.dateStart != null && req.body.dateEnd == null) query['startDate'] = {'$gte': req.body.dateStart};
        if (req.body.dateEnd != null && req.body.dateStart == null) query['startDate'] = {'$lte': req.body.dateEnd};
        if (req.body.dateStart != null && req.body.dateEnd != null) query['startDate'] = {'$gte': req.body.dateStart, '$lte': req.body.dateEnd};
        Configurations.find({}, (err, configs) => {
          if (err) {
            res.send(err);
          } else if (configs.length == 0) {
            res.status(500).send('Configuration not defined');
          } else {
            var maxTrips = configs[0].resultsNumberFinder;
            Trip.find(query).limit(maxTrips).exec((err, trips) => {
              req.body['trips'] = trips;
              console.log(trips.length);
              Finder.findOneAndUpdate({_id: req.params.finderId}, req.body, {new: true}, function(err, finder) {
                if (err){
                    res.send(err);
                }
                else{
                    res.json(req.body);
                }
              });
            });
          }
        });
      }
    });
  }
};

exports.delete_a_finder = function(req, res) {
    Finder.remove({_id: req.params.finderId}, function(err, finder) {
        if (err){
            res.send(err);
        }
        else{
            res.json({ message: 'Finder successfully deleted' });
        }
    });
};