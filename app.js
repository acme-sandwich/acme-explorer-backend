var express = require('express'),
  app = express(),
  port = process.env.PORT || 8080,
  mongoose = require('mongoose'),
  Actor = require('./api/models/actorModel'),
  Finder = require('./api/models/finderModel'),
  Sponsorship = require('./api/models/sponsorshipModel'),
  Trip = require('./api/models/tripModel'),
  Application = require('./api/models/applicationModel'),
  Configuration = require('./api/models/configurationModel'),
  bodyParser = require('body-parser');

// MongoDB URI building
const mongoDBHostname = process.env.mongoDBHostname || 'acme-explorer-xlwrw.mongodb.net';
const mongoDBName = process.env.mongoDBName || 'ACME-Explorer';
const mongoDBUser = process.env.mongoDBUser || 'db-user';
const mongoDBPass = process.env.mongoDBPass || 'db-user';
const mongoDBPort = process.env.mongoDBPort || "27017"; // Not used in Mongo Atlas

mongoDBURI = `mongodb+srv://${mongoDBUser}:${mongoDBPass}@${mongoDBHostname}:/${mongoDBName}`;

mongoose.connect(mongoDBURI, {
    reconnectTries: 10,
    reconnectInterval: 500,
    poolSize: 10, // Up to 10 sockets
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // skip trying IPv6
    useNewUrlParser: true,
    useFindAndModify: false
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routesActors = require('./api/routes/actorRoutes');
var routesTrips = require('./api/routes/tripRoutes'); 
var routesFinder = require('./api/routes/finderRoutes');
var routesSponsorship = require('./api/routes/sponsorshipRoutes');
var routesApplications = require('./api/routes/applicationRoutes');
var routesConfigurations = require('./api/routes/configurationRoutes');
var routesStorage = require('./api/routes/storageRoutes');


routesActors(app);
routesTrips(app);
routesFinder(app);
routesSponsorship(app);
routesApplications(app);
routesConfigurations(app);
routesStorage(app);


console.log("Connecting DB to: " + mongoDBURI);
mongoose.connection.on("open", function (err, conn) {
    app.listen(port, function () {
        console.log('ACME-Explorer RESTful API server started on: ' + port);
    });
});

mongoose.connection.on("error", function (err, conn) {
    console.error("DB init error " + err);
});