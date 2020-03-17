'use strict';
module.exports = function(app) {
  var applications = require('../controllers/applicationController');
  var authController = require('../controllers/authController');

  app.route('/api/v1/applications')
    .get(authController.verifyUser(["MANAGER"]), applications.list_all_applications_all_trips);

  app.route('/api/v1/my-applications')
	  .get(applications.list_all_applications)
    .post(applications.create_an_application);
    
  app.route('/api/v2/my-applications')
	  .get(applications.list_my_applications)
	  .post(authController.verifyUser(["EXPLORER"]),applications.create_an_application);

  app.route('/api/v1/applications/:applicationId')
    .get(applications.read_an_application)
	  .put(applications.update_an_application)
    .delete(applications.delete_an_application);

  app.route('/api/v2/applications/:applicationId')
    .get(authController.verifyUser(["MANAGER", "EXPLORER"]), applications.read_an_application_v2)
	  .put(authController.verifyUser(["MANAGER", "EXPLORER"]), applications.update_an_application_v2)
    .delete(authController.verifyUser(["MANAGER", "EXPLORER"]), applications.delete_an_application_v2);
  
  app.route('/api/v1/trips/:tripId/applications')
    .get(applications.list_all_applications);

  app.route('/api/v2/trips/:tripId/applications')
    .get(authController.verifyUser(["MANAGER"]),applications.list_all_applications_v2);

  app.route('/api/v1/applications/cancel/:applicationId')
    .put(applications.cancel_an_application);

  app.route('/api/v2/applications/cancel/:applicationId')
    .put(authController.verifyUser(["MANAGER"]), applications.cancel_an_application_v2);
  
  app.route('/api/v1/applications/reject/:applicationId')
    .put(applications.reject_an_application);

  app.route('/api/v2/applications/reject/:applicationId')
    .put(authController.verifyUser(["MANAGER"]), applications.reject_an_application_v2);

  app.route('/api/v1/applications/due/:applicationId')
    .put(applications.due_an_application);

  app.route('/api/v2/applications/due/:applicationId')
    .put(authController.verifyUser(["MANAGER"]), applications.due_an_application_v2);
};