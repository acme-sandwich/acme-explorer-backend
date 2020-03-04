'use strict';
module.exports = function(app) {
  var actors = require('../controllers/actorController');

  app.route('/api/v1/actors')
	  .get(actors.list_all_actors)
	  .post(actors.create_an_actor);

  app.route('/api/v1/actors/:actorId')
    .get(actors.read_an_actor)
	  .put(actors.update_an_actor)
    .delete(actors.delete_an_actor);
};