'use strict';
var mocker = require('mocker-data-generator').default;
var mongoose = require('mongoose');
var util = require('util');
var ActorModel = mongoose.model('Actors');
var TripModel = mongoose.model('Trips');
var ApplicationModel = mongoose.model('Applications');
var SponsorshipModel = mongoose.model('Sponsorships');
var FinderModel = mongoose.model('Finders');


exports.generate_mocker_data = function (req, res) {
    var explorer = {
        _id: {
            function: function () {
                return mongoose.Types.ObjectId();
            }
        },
        name: {
            faker: 'name.firstName'
        },
        surname: {
            faker: 'name.lastName'
        },
        email: {
            faker: 'internet.email'
        },
        password: {
            function: function () {
                return "password1234";
            }
        },
        phone: {
            faker: 'phone.phoneNumber'
        },
        address: {
            faker: 'address.streetAddress'
        },
        role: {
            function: function () {
                return "EXPLORER";
            }
        },
        banned: {
            function: function () {
                return false;
            }
        }
    };

    var manager = {
        _id: {
            function: function () {
                return mongoose.Types.ObjectId();
            }
        },
        name: {
            faker: 'name.firstName'
        },
        surname: {
            faker: 'name.lastName'
        },
        email: {
            faker: 'internet.email'
        },
        password: {
            function: function () {
                return "password1234";
            }
        },
        phone: {
            faker: 'phone.phoneNumber'
        },
        address: {
            faker: 'address.streetAddress'
        },
        role: {
            function: function () {
                return "MANAGER";
            }
        },
        banned: {
            function: function () {
                return false;
            }
        }
    };

    var administrator = {
        _id: {
            function: function () {
                return mongoose.Types.ObjectId();
            }
        },
        name: {
            faker: 'name.firstName'
        },
        surname: {
            faker: 'name.lastName'
        },
        email: {
            faker: 'internet.email'
        },
        password: {
            function: function () {
                return "password1234";
            }
        },
        phone: {
            faker: 'phone.phoneNumber'
        },
        address: {
            faker: 'address.streetAddress'
        },
        role: {
            function: function () {
                return "ADMINISTRATOR";
            }
        },
        banned: {
            function: function () {
                return false;
            }
        }
    };

    var sponsor = {
        _id: {
            function: function () {
                return mongoose.Types.ObjectId();
            }
        },
        name: {
            faker: 'name.firstName'
        },
        surname: {
            faker: 'name.lastName'
        },
        email: {
            faker: 'internet.email'
        },
        password: {
            function: function () {
                return "password1234";
            }
        },
        phone: {
            faker: 'phone.phoneNumber'
        },
        address: {
            faker: 'address.streetAddress'
        },
        role: {
            function: function () {
                return "SPONSOR";
            }
        },
        banned: {
            function: function () {
                return false;
            }
        }
    };

    var stage = {
        title: {
            function: function () {
                return this.faker.address.country() + " " + this.faker.commerce.product();
            }
        },
        description: {
            faker: 'lorem.paragraph'
        },
        price: {
            faker: 'random.number({"min": 1, "max": 100})'
        }
    };

    var picture = {
        data: {
             randexp: /(https:\/\/moneydotcomvip\.files\.wordpress\.com\/2017\/08\/route-66\.jpg|https:\/\/contactar-con\.com\/wp-content\/uploads\/2019\/05\/trip-700x400\.jpg|https:\/\/www\.moneycrashers\.com\/wp-content\/uploads\/2019\/04\/plan-road-trip-tips-ideas\.jpg|https:\/\/www\.65ymas\.com\/uploads\/s1\/10\/57\/8\/10-cosas-que-ver-en-lisboa\.jpeg)/
        },
        contentType: {
            function: function () {
                return "image/jpeg";
            }
        }
    };

    var trip = {
        _id: {
            function: function () {
                return mongoose.Types.ObjectId();
            }
        },
        title: {
            function: function () {
                return this.faker.address.country() + " " + this.faker.commerce.product();
            }
        },
        description: {
            faker: 'lorem.paragraph'
        },
        picture: {
            hasMany: 'pictures',
            min: 1,
            max: 5,
            unique: false
        },
        stages: {
            hasMany: 'stages',
            min: 1,
            max: 5,
            unique: true
        },
        price: {
            function: function () {
                var stages = this.object.stages;
                var price = 0;
                for (var i = 0; i < stages.length; i++) {
                    price = price + stages[i].price;
                }

                return price;

            }
        },
        requirements: {
            faker: 'lorem.paragraph'
        },
        startDate: {
            function: function () {
                return this.faker.date.between('2019-12-31', '2020-06-25');
            }
        },
        endDate: {
            function: function () {
                var date = new Date(this.object.startDate);
                var date2 = this.faker.date.between(date, '2020-06-30');
                return date2;
            }
        },
        published: {
            faker: 'random.boolean'
        },
        cancelled: {
            function: function () {
                if (this.object.published) {
                    return this.faker.random.boolean();
                } else {
                    return false;
                }
            }
        },
        cancelledReason: {
            function: function () {
                if (this.object.cancelled) {
                    return this.faker.lorem.sentence();
                }
            }
        },
        creator: {
            hasOne: 'managers',
            get: '_id'
        },
        created: {
            function: function () {
                var date = new Date(this.object.startDate);
                var date2 = this.faker.date.between("2019-12-30", date);
                return date2;
            }
        },
        deleted: {
            function: function () {
                return false;
            }
        }
    };

    var application = {
        trip: {
            hasOne: 'trips',
            get: '_id'
        },
        explorer: {
            hasOne: 'explorers',
            get: '_id'
        },
        moment: {
            function: function () {
                return this.faker.date.between("2019-12-30", "2020-02-01");
            }
        },
        updateMoment: {
            function: function () {
                return this.faker.date.between("2019-12-30", "2020-02-01");
            }
        },
        status: {
            randexp: /PENDING|REJECTED|DUE|ACCEPTED|CANCELLED/
        },
        comment: {
            faker: 'lorem.paragraph'
        },
        reason: {
            function: function () {
                if (this.object.status === "REJECTED") {
                    return "Rechazado por exceso de participantes";
                }
            }
        }
    };

    var sponsorship = {
        sponsor: {
            hasOne: 'sponsors',
            get: '_id'
        },
        trips: {
            hasMany: 'trips',
            min: 0,
            max: 3,
            unique: true,
            get: '_id'
        },
        banner: {
            function: function () {
                var json_object = {
                    "data": "https://image.shutterstock.com/image-vector/blue-thunder-on-purple-pink-260nw-1524614582.jpg",
                    "contentType": "image/jpeg"
                }
                return json_object;
            }
        },
        landingPage: {
            faker: 'internet.url'
        },
        payed: {
            faker: 'random.boolean'
        }
    };

    var finder = {
        explorer: {
            hasOne: 'explorers',
            get: '_id',
            unique: true
        },
        trips: {
            hasMany: 'trips',
            min: 0,
            max: 10,
            unique: true,
            get: '_id'
        },
        defaultFinder: {
            faker: 'random.boolean',
            virtual: true
        },
        keyWord: {
            function: function () {
                if (!this.object.defaultFinder) {
                    return this.faker.commerce.product();
                } else {
                    return null;
                }
            }
        },
        minPrice: {
            function: function () {
                if (!this.object.defaultFinder) {
                    return this.faker.random.number({ 'min': 1, 'max': 50 });
                } else {
                    return null;
                }
            }
        },
        maxPrice: {
            function: function () {
                if (!this.object.defaultFinder) {
                    return this.faker.random.number({ 'min': 50, 'max': 300 });
                } else {
                    return null;
                }
            }
        },
        dateStart: {
            function: function () {
                if (!this.object.defaultFinder) {
                    var date = this.faker.date.between("2019-12-30", "2020-02-01");
                    return date;
                } else {
                    return null;
                }
            }
        },
        dateEnd: {
            function: function () {
                if (!this.object.defaultFinder) {
                    var date = this.faker.date.between("2020-02-01", "2020-06-10");
                    return date;
                } else {
                    return null;
                }
            }
        },
        moment: {
            function: function () {
                var date = this.faker.date.between("2020-01-01", "2020-02-01");
                return date;
            }
        }
    }

    mocker()
        .schema('explorers', explorer, 25)
        .schema('managers', manager, 25)
        .schema('administrators', administrator, 25)
        .schema('sponsors', sponsor, 25)
        .schema('pictures', picture, 25)
        .schema('stages', stage, 25)
        .schema('trips', trip, 50)
        .schema('applications', application, 25)
        .schema('sponsorships', sponsorship, 25)
        .schema('finders', finder, 25)
        .build(function (err, data) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                console.log('Trying to create mock objects...');
                var explorers = data.explorers;
                var managers = data.managers;
                var administrators = data.administrators;
                var sponsors = data.sponsors;
                var trips = data.trips;
                var applications = data.applications;
                var sponsorships = data.sponsorships;
                var finders = data.finders;

                for (var i = 0; i < explorers.length; i++) {
                    var new_explorer = new ActorModel(explorers[i]);
                    new_explorer.save(function (err, exp) {
                        if (err) {
                            console.error("Error when trying to save explorer " + exp + ": " + err);
                        }
                        else {
                            console.log("Explorer properly created");
                        }
                    });
                }

                for (var i = 0; i < managers.length; i++) {
                    var new_manager = new ActorModel(managers[i]);
                    new_manager.save(function (err, manag) {
                        if (err) {
                            console.error("Error when trying to save manager " + manag + ": " + err);
                        }
                        else {
                            console.log("Manager properly created");
                        }
                    });
                }

                for (var i = 0; i < administrators.length; i++) {
                    var new_administrator = new ActorModel(administrators[i]);
                    new_administrator.save(function (err, adm) {
                        if (err) {
                            console.error("Error when trying to save admin " + adm + ": " + err);
                        }
                        else {
                            console.log("Administrator properly created");
                        }
                    });
                }

                for (var i = 0; i < sponsors.length; i++) {
                    var new_sponsor = new ActorModel(sponsors[i]);
                    new_sponsor.save(function (err, spo) {
                        if (err) {
                            console.error("Error when trying to save sponsor " + spo + ": " + err);
                        }
                        else {
                            console.log("Sponsor properly created");
                        }
                    });
                }

                for (var i = 0; i < trips.length; i++) {
                    var new_trip = new TripModel(trips[i]);
                    new_trip.save(function (err, tr) {
                        if (err) {
                            console.error("Error when trying to save trip " + tr + ": " + err);
                        }
                        else {
                            console.log("Trip properly created");
                        }
                    });
                }

                for (var i = 0; i < applications.length; i++) {
                    var new_application = new ApplicationModel(applications[i]);
                    new_application.save(function (err, app) {
                        if (err) {
                            console.error("Error when trying to save application " + app + ": " + err);
                        }
                        else {
                            console.log("Application properly created");
                        }
                    });
                }

                for (var i = 0; i < sponsorships.length; i++) {
                    var new_sponsorship = new SponsorshipModel(sponsorships[i]);
                    new_sponsorship.save(function (err, spshp) {
                        if (err) {
                            console.error("Error when trying to save sposorship " + spshp + ": " + err);
                        }
                        else {
                            console.log("Sponsorship properly created");
                        }
                    });
                }

                for (var i = 0; i < finders.length; i++) {
                    var new_finder = new FinderModel(finders[i]);
                    new_finder.save(function (err, fndr) {
                        if (err) {
                            console.error("Error when trying to save finder " + fndr + ": " + err);
                        }
                        else {
                            console.log("Finder properly created");
                        }
                    });
                }

                res.status(201).send("Objects created satisfactorily");
            }
        });
};
