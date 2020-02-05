'use strict';
module.exports = function(app) {
  var items = require('../controllers/itemController');

  app.route('/items')
		.get(items.list_all_items)
		.post(items.create_an_item);

  app.route('/items/:itemId')
    .get(items.read_an_item)
	  .put(items.update_an_item)
    .delete(items.delete_an_item);

  var items = require('../controllers/itemController');

  app.route('/categories')
    .get(items.list_all_categories)
    .post(items.create_a_category);

  app.route('/categories/:categId')
    .get(items.read_a_category)
    .put(items.update_a_category)
    .delete(items.delete_a_category);
};
