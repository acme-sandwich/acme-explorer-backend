'use strict';


var mongoose = require('mongoose'),
  Order = mongoose.model('Orders');

exports.list_all_orders = function(req, res) {
  Order.find({}, function(err, order) {
    if (err){
      res.send(err);
    }
    else{
      res.json(order);
    }
  });
};

exports.list_my_orders = function(req, res) {
  Order.find(function(err, orders) {
    if (err){
      res.send(err);
    }
    else{
      res.json(orders);
    }
  });
};


exports.create_an_order = function(req, res) {
  var new_order = new Order(req.body);

  new_order.save(function(error, order) {
    if (error){
      res.send(error);
    }
    else{
      res.json(order);
    }
  });
};


exports.read_an_order = function(req, res) {
  Order.findById(req.params.orderId, function(err, order) {
    if (err){
      res.send(err);
    }
    else{
      res.json(order);
    }
  });
};


exports.update_an_order = function(req, res) {
  Order.findById(req.params.orderId, function(err, order) {
      if (err){
        res.send(err);
      }
      else{
          Order.findOneAndUpdate({_id: req.params.orderId}, req.body, {new: true}, function(err, order) {
            if (err){
              res.send(err);
            }
            else{
              res.json(order);
            }
          });
        }
    });
};


exports.delete_an_order = function(req, res) {
  Order.remove({
    _id: req.params.orderId
  }, function(err, order) {
    if (err){
      res.send(err);
    }
    else{
      res.json({ message: 'Order successfully deleted' });
    }
  });
};
