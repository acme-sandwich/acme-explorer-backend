'use strict';
module.exports = function (app) {
    var dashboard = require('../controllers/tripController');

    app.route('/v1/dashboard') // Returns all the dashboard metrics present in the requirements document.
        .get(dashboard.dashboard_info)

    app.route('/v1/cube') // Returns he amount of money that explorer e has spent on trips during period p, so it needs query params.
        .get(dashboard.cube)

    app.route('/v1/cube/explorers') // Returns the explorers that spent the money returned by the cube, so it needs query params. 
        .get(dashboard.cube_explorers)

}