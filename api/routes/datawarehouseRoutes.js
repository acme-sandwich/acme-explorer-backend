'use strict';
module.exports = function (app) {
    var datawarehouse = require('../controllers/datawarehouseController');

    // Returns all the dashboard / datawarehouse metrics present in the requirements document.
    app.route('/v1/datawarehouse')
        .get(datawarehouse.list_all_indicators)
        .post(datawarehouse.rebuildPeriod)
        
    // Returns the latest dashboard / datawarehouse indicators.
    app.route('/v1/datawarehouse/latest')
        .get(datawarehouse.last_indicator)

    // Returns he amount of money that explorer e has spent on trips during period p, so it needs query params.
    app.route('/v1/cube/:explorer/:period')
        .get(datawarehouse.cube)

    // Returns the explorers that spent the money returned by the cube, so it needs query params. 
    app.route('/v1/cube/explorers')
        .get(datawarehouse.cube_explorers)

}