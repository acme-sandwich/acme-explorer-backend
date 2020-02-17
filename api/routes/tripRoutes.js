'use strict';
module.exports = function (app) {
    var trips = require('../controllers/tripController');

    app.route('/trips')
        .get(trips.list_all_trips)
        .post(trips.create_a_trip);

    app.route('/trips/search') // Must receive parameter 'keyword'.
        .get(trips.search_from_keyword);

    app.route('/trips/:tripId')
        .get(trips.read_a_trip)
        .put(trips.update_a_trip)
        .delete(trips.delete_a_trip);

    app.route('/trips/publish/:tripId')
        .put(trips.publish_a_trip);

    app.route('/trips/cancel/:tripId')
        .put(trips.cancel_a_trip);
};
