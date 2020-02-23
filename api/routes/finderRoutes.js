'use strict';
module.exports = function(app) {
  var finders = require('../controllers/finderController');

  app.route('/v1/actors/:actorId/finders')
	  .get(finders.list_all_finders)
	  .post(finders.create_a_finder);

  app.route('/v1/actors/:actorId/finders/:finderId')
    .get(finders.read_a_finder)
	  .put(finders.update_a_finder);
};