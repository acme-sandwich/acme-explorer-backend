'use strict';
module.exports = function(app) {
  var actors = require('../controllers/actorController');
  var authController = require('../controllers/authController');

  app.route('/api/v1/actors')
	  .get(actors.list_all_actors)
    .post(actors.create_an_actor);
    
  app.route('/api/v2/manager')
    .post(authController.verifyUser(["ADMINISTRATOR"]),actors.create_a_manager);
    
  app.route('/api/v2/admin')
	  .post(authController.verifyUser(["ADMINISTRATOR"]),actors.create_an_admin);

  app.route('/api/v1/actors/:actorId')
    .get(actors.read_an_actor)
	  .put(actors.update_an_actor)
    .delete(actors.delete_an_actor);

    /**
   * Put an actor
   *    RequiredRoles: to be the proper actor
   * Get an actor
   *    RequiredRoles: any
	 *
	 * @section actors
	 * @type get put
	 * @url /v2/actors/:actorId
  */  
  app.route('/api/v2/actors/:actorId')
    .get(actors.read_an_actor)
    .put(authController.verifyUser(["ADMINISTRATOR",
                                 "MANAGER", "EXPLORER",
                                 "SPONSOR"]),actors.update_a_verified_actor)
    .delete(authController.verifyUser(["ADMINISTRATOR",
    "MANAGER", "EXPLORER",
    "SPONSOR"]), actors.delete_an_actor_v2);
                      

  app.route('/api/v1/actors/ban/:actorId')
    .put(actors.ban_an_actor);

  app.route('/api/v1/actors/unban/:actorId')
    .put(actors.unban_an_actor);

  app.route('/api/v2/actors/ban/:actorId')
    .put(authController.verifyUser(["ADMINISTRATOR"]),actors.ban_an_actor_v2);

  app.route('/api/v2/actors/unban/:actorId')
    .put(authController.verifyUser(["ADMINISTRATOR"]),actors.unban_an_actor_v2);
};