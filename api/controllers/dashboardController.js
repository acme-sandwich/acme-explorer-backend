'use strict';
/*---------------DASHBOARD----------------------*/
var mongoose = require('mongoose'),
	Trip = mongoose.model('Trips'),
    Application = mongoose.model('Applications'),
    Actor = mongoose.model('Actors'),
    Configuration = mongoose.model('Configuration'),
    Finder = mongoose.model('Finders'),
    Sponsorship = mongoose.model('Sponsorships');

exports.dashboard_info = function (req, res) {
// TODO Generate the different metrics that the requirements doc says about dashboards.
};

exports.cube = function (req, res){

};

exports.cube_explorers = function (req, res){

};