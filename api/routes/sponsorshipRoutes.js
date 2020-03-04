'use strict';
module.exports = function(app) {
  var sponsorships = require('../controllers/sponsorshipController');

  app.route('/api/v1/actors/:actorId/sponsorships')
	  .get(sponsorships.list_all_sponsorships)
	  .post(sponsorships.create_a_sponsorship);

  app.route('/api/v1/actors/:actorId/sponsorships/:sponsorshipId')
    .get(sponsorships.read_a_sponsorship)
    .put(sponsorships.update_a_sponsorship)
    .delete(sponsorships.delete_a_sponsorship);
  
  app.route('/api/v1/actors/:actorId/sponsorships/:sponsorshipId/pay')
    .put(sponsorships.pay_a_sponsorship);
  
  app.route('/api/v1/trips/:tripId/sponsorships')
    .get(sponsorships.list_all_sponsorships);
};