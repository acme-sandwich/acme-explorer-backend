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
  DataWareHouse = require('./api/models/datawarehouseModel').DataWareHouse,
  DataWareHouseTools = require('./api/controllers/datawarehouseController'),
  Cube = require('./api/models/datawarehouseModel').Cube,
  bodyParser = require('body-parser');
var admin = require('firebase-admin');
var serviceAccount = require("./acme-sandwich-explorer-firebase-adminsdk-9cn2y-a845a0ffa2");

// MongoDB URI building
const mongoDBName = process.env.mongoDBName || 'ACME-Explorer';
const mongoDBPort = process.env.DBPORT || 27017; // Not used in Mongo Atlas

mongoDBURI = `mongodb://mongo:${mongoDBPort}/${mongoDBName}`;
//mongoDBURI = `mongodb+srv://antrodart-acme-explorer:antrodart-acme-explorer@cluster0-a3rhn.mongodb.net/test?retryWrites=true&w=majority`;

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

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, idToken" //ojo, que si metemos un parametro propio por la cabecera hay que declararlo aquí para que no de el error CORS
    );
    //res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    next();
});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://acme-sandwich-explorer.firebaseio.com"
});

var routesActors = require('./api/routes/actorRoutes');
var routesTrips = require('./api/routes/tripRoutes'); 
var routesFinder = require('./api/routes/finderRoutes');
var routesSponsorship = require('./api/routes/sponsorshipRoutes');
var routesApplications = require('./api/routes/applicationRoutes');
var routesConfigurations = require('./api/routes/configurationRoutes');
var routesStorage = require('./api/routes/storageRoutes');
var routesDatawarehouse = require('./api/routes/datawarehouseRoutes');
var routesLogin = require('./api/routes/loginRoutes');


routesActors(app);
routesTrips(app);
routesFinder(app);
routesSponsorship(app);
routesApplications(app);
routesConfigurations(app);
routesStorage(app);
routesDatawarehouse(app);
routesLogin(app);


console.log("Connecting DB to: " + mongoDBURI);
mongoose.connection.on("open", function (err, conn) {
    app.listen(port, function () {
        console.log('ACME-Explorer RESTful API server started on: ' + port);
    });
});

mongoose.connection.on("error", function (err, conn) {
    console.error("DB init error " + err);
});

DataWareHouseTools.createDataWareHouseJob();

module.exports = app;