'use strict';
module.exports = function (app) {
    var dashboard = require('../controllers/tripController');

    app.route('/dashboard') // Returns all the dashboard metrics present in the requirements document.
        .get(dashboard.dashboard_info)

    app.route('/cube') // Returns he amount of money that explorer e has spent on trips during period p, so it needs query params.
        .get(dashboard.cube)

    app.route('/cube/explorers') // Returns the explorers that spent the money returned by the cube, so it needs query params. 
        .get(dashboard.cube_explorers)

}