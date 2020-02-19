'use strict';
var mocker = require('mocker-data-generator').default;
var mongoose = require('mongoose');
var util = require('util');

exports.generate_mocker_data = function(req, res){
    var explorer = {
        id: {
            function: function(){
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
            function: function(){
                return "password1234";
             }
        },
        phone: {
            faker: 'phone.phoneNumber'
        },
        address:{
            faker: 'address.streetAddress'
        },
        role: {
            function: function(){
                return "EXPLORER";
             }
        },
        banned: {
            function: function(){
                return false;
             }
        }
    };

    var manager = {
        id: {
            function: function(){
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
            function: function(){
                return "password1234";
             }
        },
        phone: {
            faker: 'phone.phoneNumber'
        },
        address:{
            faker: 'address.streetAddress'
        },
        role: {
            function: function(){
                return "MANAGER";
             }
        },
        banned: {
            function: function(){
                return false;
             }
        }
    };

    var administrator = {
        id: {
            function: function(){
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
            function: function(){
                return "password1234";
             }
        },
        phone: {
            faker: 'phone.phoneNumber'
        },
        address:{
            faker: 'address.streetAddress'
        },
        role: {
            function: function(){
                return "ADMINISTRATOR";
             }
        },
        banned: {
            function: function(){
                return false;
             }
        }
    };

    var sponsor = {
        id: {
            function: function(){
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
            function: function(){
                return "password1234";
             }
        },
        phone: {
            faker: 'phone.phoneNumber'
        },
        address:{
            faker: 'address.streetAddress'
        },
        role: {
            function: function(){
                return "SPONSOR";
             }
        },
        banned: {
            function: function(){
                return false;
             }
        }
    };

    var stage = {
        title:{
            function: function(){
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

    var trip = {
        id: {
            function: function(){
                return mongoose.Types.ObjectId();
             }
        },
        title:{
            function: function(){
                return this.faker.address.country() + " " + this.faker.commerce.product();
            }
        },
        description: {
            faker: 'lorem.paragraph'
        },
        stages: {
            hasMany: 'stages',
            min: 1,
            max: 5,
            unique: true
        },
        price:{
             function: function(){
                var stages = this.object.stages;
                var price = 0;
                for(var i = 0; i < stages.length; i++){
                    price = price + stages[i].price;
                }

                return price;

             }
        },
        requirements: {
            faker: 'lorem.paragraph'
        },
        startDate: {
            function: function(){
                return this.faker.date.between('2019-12-31', '2020-06-25');
            }
        },
        endDate:{
            function: function(){
                var date = new Date(this.object.startDate);
                var date2 = this.faker.date.between(date, '2020-06-30');
                return date2;
            }
        },
        published: {
            faker: 'random.boolean'
        },
        cancelled: {
            function: function(){
                if(this.object.published){
                    return this.faker.random.boolean();
                }else{
                   return false; 
                }
            }
        },
        cancelledReason: {
            function: function(){
                if(this.object.cancelled){
                    return this.faker.lorem.sentence();
                }
            }
        },
        creator: {
            hasOne: 'managers',
            get: 'id'
        },
        created: {
            function: function(){
                var date = new Date(this.object.startDate);
                var date2 = this.faker.date.between("2019-12-30", date);
                return date2;
            }
        },
        deleted: {
            function: function(){
                return false;
            }
        }
    };

    var application = {
        trip: {
            hasOne: 'trips',
            get: 'id'
        },
        explorer: {
            hasOne: 'explorers',
            get: 'id'
        },
        moment: {
            function: function(){
                var dateTripCreation = this.object.trip.created;
                var dateStartTrip = this.object.trip.startDate;
                return this.faker.date.between(dateTripCreation, dateStartTrip);
            }
        },
        status: {
            randexp: /PENDING|REJECTED|DUE|ACCEPTED|CANCELLED/
        },
        comment: {
            faker: 'lorem.paragraph'
        },
        reason: {
            function: function(){
                if(this.object.status === "REJECTED"){
                    return "Rechazado por exceso de participantes";
                }
            }
        }
    };

    var sponsorship = {
        sponsor: {
            hasOne: 'sponsors',
            get: 'id'
        },
        trips: {
            hasMany: 'trips',
            min: 0,
            max: 3,
            unique: true,
            get: 'id'
        },
        image: {
            function: function(){
                return "https://image.shutterstock.com/image-vector/blue-thunder-on-purple-pink-260nw-1524614582.jpg"; 
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
            get: 'id',
            unique: true
        },
        trips: {
            hasMany: 'trips',
            min: 0,
            max: 10,
            unique: true,
            get: 'id'
        },
        defaultFinder:{
            faker: 'random.boolean',
            virtual: true
        }, 
        keyword: {
            function: function(){
                if(!this.object.defaultFinder){
                    return this.faker.lorem.word();
                }
            }
        },
        minPrice: {
            function: function(){
                if(!this.object.defaultFinder){
                    return this.faker.random.number({'min':1, 'max':50});
                }
            }
        },
        maxPrice: {
            function: function(){
                if(!this.object.defaultFinder){
                    return this.faker.random.number({'min':50, 'max':300});
                }
            }
        },
        dateStart: {
            function: function(){
                var date = this.faker.date.between("2019-12-30", "2020-02-01");
                return date;
            }
        },
        dateEnd: {
            function: function(){
                var date = this.faker.date.between("2020-02-01", "2020-06-10");
                return date;
            }
        },
        moment: {
            function: function(){
                var date = this.faker.date.between("2020-01-01", "2020-02-01");
                return date;
            }
        }
    }

    mocker()
    .schema('explorers', explorer, 5)
    .schema('managers', manager, 5)
    .schema('administrators', administrator, 5)
    .schema('sponsors', sponsor, 5)
    .schema('stages', stage, 50)
    .schema('trips', trip, 15)
    .schema('applications',application, 5)
    .schema('sponsorships',sponsorship, 5)
    .schema('finders',finder, 5)
    .build(function(err, data) {
        if(err){
            res.send(err);
        }else{
            res.json(data);
        }
    });
    
};
