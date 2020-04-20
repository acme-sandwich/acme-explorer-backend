'use strict';
module.exports = function(app) {
  var audits = require('../controllers/auditController');

  app.route('/api/v1/audits')
    .get(audits.list_all_audits);
  
  app.route('/api/v1/actors/:actorId/audits')
	  .get(audits.list_my_audits)
    .post(audits.create_a_audit);

  app.route('/api/v1/actors/:actorId/audits/:auditId')
    .get(audits.read_a_audit)
    .put(audits.update_a_audit)
    .delete(audits.delete_a_audit);
  
  app.route('/api/v1/trips/:tripId/audits')
    .get(audits.list_trip_audits);
};