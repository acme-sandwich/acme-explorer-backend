'use strict';
module.exports = function (app) {
    var datawarehouse = require('../controllers/datawarehouseController');

    app.route('/v1/datawarehouse') // Returns all the dashboard metrics present in the requirements document.
        .get(datawarehouse.datawarehouse_info)

    app.route('/v1/cube') // Returns he amount of money that explorer e has spent on trips during period p, so it needs query params.
        .get(datawarehouse.cube)

    app.route('/v1/cube/explorers') // Returns the explorers that spent the money returned by the cube, so it needs query params. 
        .get(datawarehouse.cube_explorers)

}