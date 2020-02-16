'use strict';
module.exports = function (app) {
    var configuration = require('../controllers/configurationController');

    app.route('/configurations')
        .get(configuration.list_all_configurations)
        .get(configuration.get_current_configuration)
        .post(configuration.create_a_configuration);

    app.route('/configurations/:configurationId')
        .put(configuration.update_configuration)
        .delete(configuration.delete_a_configuration);
};
