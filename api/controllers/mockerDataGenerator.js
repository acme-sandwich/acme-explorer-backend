'use strict';
var mocker = require('mocker-data-generator').default;
var mongoose = require('mongoose');

exports.generate_mocker_data = function(req, res){
    var actor = {
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
            randexp: /ADMINISTRATOR|EXPLORER|MANAGER|SPONSOR/
        },
        banned: {
            function: function(){
                return false;
             }
        }
    };

    var trip = {
        title:{
            function: function(){
                return this.faker.address.country() + " " + this.faker.commerce.product();
            }
        },
        description: {
            faker: 'lorem.paragraph'
        },
        price:{
             function: function(){
                return 0;
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
            hasOne: 'actors',
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

    mocker()
    .schema('actors', actor, 5)
    .schema('trips', trip, 3)
};
