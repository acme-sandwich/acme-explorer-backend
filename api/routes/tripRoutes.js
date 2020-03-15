'use strict';
module.exports = function (app) {
    var trips = require('../controllers/tripController');
    var authController = require('../controllers/authController');

    app.route('/api/v1/trips')
        .get(trips.list_all_trips)
        .post(trips.create_a_trip);
    
    app.route('/api/v2/trips')
        .post(authController.verifyUser(["MANAGER"]),trips.create_a_trip);
        
    app.route('/api/v1/created-trips')
        .get(authController.verifyUser(["MANAGER"]),trips.list_created_trips)

    app.route('/api/v2/created-trips')
        .get(authController.verifyUser(["MANAGER"]),trips.list_created_trips)

    app.route('/api/v1/trips/search') // Must receive parameter 'keyword'.
        .get(trips.search_from_keyword);

    app.route('/api/v1/trips/:tripId')
        .get(trips.read_a_trip)
        .put(trips.update_a_trip)
        .delete(trips.delete_a_trip);

    app.route('/api/v2/trips/:tripId')
        .put(authController.verifyUser(["MANAGER"]),trips.update_a_trip_v2)
        .delete(authController.verifyUser(["MANAGER"]),trips.delete_a_trip_v2);

    app.route('/api/v1/trips/:tripId/publish')
        .put(trips.publish_a_trip);

    app.route('/api/v1/trips/:tripId/cancel')
        .put(trips.cancel_a_trip);

    app.route('/api/v2/trips/:tripId/publish')
        .put(authController.verifyUser(["MANAGER"]),trips.publish_a_trip_v2);

    app.route('/api/v2/trips/:tripId/cancel')
        .put(authController.verifyUser(["MANAGER"]),trips.cancel_a_trip_v2);
};
