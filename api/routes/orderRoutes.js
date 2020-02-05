'use strict';
module.exports = function(app) {
  var order = require('../controllers/orderController');
  
  app.route('/orders')
	  .get(order.list_all_orders)
	  .post(order.create_an_order);
	
  app.route('/orders/:orderId')
    .get(order.read_an_order) 
    .put(order.update_an_order) 
    .delete(order.delete_an_order);
};
