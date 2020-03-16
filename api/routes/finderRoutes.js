'use strict';
module.exports = function(app) {
  var finders = require('../controllers/finderController');
  var authController = require('../controllers/authController');

  app.route('/api/v1/actors/:actorId/finders')
  .get(finders.list_all_finders)
  .post(finders.create_a_finder);

  app.route('/api/v1/actors/:actorId/finders/:finderId')
  .get(finders.read_a_finder)
  .put(finders.update_a_finder);

  app.route('/api/v2/actors/:actorId/finders')
	  .get(authController.verifyUser(["EXPLORER"]),finders.list_all_finders)
	  .post(authController.verifyUser(["EXPLORER"]),finders.create_a_finder_v2);

  app.route('/api/v2/actors/:actorId/finders/:finderId')
    .get(authController.verifyUser(["EXPLORER"]),finders.read_a_finder_v2)
	  .put(authController.verifyUser(["EXPLORER"]),finders.update_a_finder_v2);
};