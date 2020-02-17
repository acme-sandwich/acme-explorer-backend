'use strict';
module.exports = function(app) {
  var actors = require('../controllers/actorController');

  app.route('/actors')
	  .get(actors.list_all_actors)
	  .post(actors.create_an_actor);

  app.route('/actors/:actorId')
    .get(actors.read_an_actor)
	  .put(actors.update_an_actor)
    .delete(actors.delete_an_actor);

  app.route('/explorer/apply')
    .get(actors.list_all_applications)
    .post(actors.create_application)
    .put(actors.update_an_application)
    .delete(actors.delete_an_application);

  app.route('/explorer/find')
    .get(actors.find_trip);

  app.route('/manager/organize')
    .get(actors.list_all_organized_trips)
    .post(actors.organize_trip)
    .put(actors.update_an_organized_trip)
    .delete(actors.delete_an_organized_trip);

  app.route('/sponsor/sponsorship')
    .get(actors.list_all_sponsorships)
    .post(actors.make_new_sponsorship)
    .put(actors.update_an_sponsorship)
    .delete(actors.delete_an_sponsorship);
};