'use strict';
module.exports = function (app) {
    var configuration = require('../controllers/configurationController');

    app.route('/api/v1/configurations')
        .get(configuration.list_all_configurations)
        .get(configuration.get_current_configuration)
        .post(configuration.create_a_configuration);

    app.route('/api/v1/configurations/:configurationId')
        .put(configuration.update_configuration)
        .delete(configuration.delete_a_configuration);
};
