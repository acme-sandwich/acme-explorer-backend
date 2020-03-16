'use strict';
module.exports = function(app) {
  var sponsorships = require('../controllers/sponsorshipController');
  var authController = require('../controllers/authController');

  app.route('/api/v1/actors/:actorId/sponsorships')
	  .get(sponsorships.list_all_sponsorships)
    .post(sponsorships.create_a_sponsorship);
    
  app.route('/api/v2/sponsorships')
	  .get(authController.verifyUser(["SPONSOR"]),sponsorships.list_my_sponsorships)
	  .post(authController.verifyUser(["SPONSOR"]),sponsorships.create_a_sponsorship_v2);

  app.route('/api/v1/actors/:actorId/sponsorships/:sponsorshipId')
    .get(sponsorships.read_a_sponsorship)
    .put(sponsorships.update_a_sponsorship)
    .delete(sponsorships.delete_a_sponsorship);

  app.route('/api/v2/actors/:actorId/sponsorships/:sponsorshipId')
    .get(authController.verifyUser(["SPONSOR"]),sponsorships.read_a_sponsorship_mine)
    .put(authController.verifyUser(["SPONSOR"]),sponsorships.update_a_sponsorship_v2)
    .delete(authController.verifyUser(["SPONSOR"]),sponsorships.delete_a_sponsorship_v2);
  
  app.route('/api/v1/actors/:actorId/sponsorships/:sponsorshipId/pay')
    .put(sponsorships.pay_a_sponsorship);

  app.route('/api/v2/sponsorships/:sponsorshipId/pay')
    .put(authController.verifyUser(["SPONSOR"]),sponsorships.pay_a_sponsorship_v2);
  
  app.route('/api/v1/trips/:tripId/sponsorships')
    .get(sponsorships.list_all_sponsorships);
};