'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var ActorSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the actor name'
  },
  surname: {
    type: String,
    required: 'Kindly enter the actor surname'
  },
  email: {
    type: String,
    required: 'Kindly enter the actor email',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    minlength: 5,
    required: 'Kindly enter the actor password'
  },
  phone: {
    type: String,
  },
  address: {
    type: String
  },
  role: [{
    type: String,
    required: 'Kindly enter the user role(s)',
    enum: ['ADMINISTRATOR', 'MANAGER', 'EXPLORER', 'SPONSOR']
  }],
  banned: {
    type: Boolean,
    default: false
  },
  customToken: {
    type: String
  }
}, { strict: false });

ActorSchema.index({ banned: 1 });
ActorSchema.index({ role: 'text' });

var hashPassword = function (password) {
  return new Promise(function (resolve, reject) {
    if (password) {
      var salt = bcrypt.genSaltSync(5);
      var hash = bcrypt.hashSync(password, salt);
      resolve(hash);
    } else {
      var error = new Error('Password needed');
      reject(error);
    }
  });
};

ActorSchema.pre('save', async function (callback) {
  var actor = this;
  hashPassword(actor.password).then(function (myhash) {
    actor.password = myhash;
    callback();
  })
});

ActorSchema.pre('findOneAndUpdate', async function(callback){
  const docToUpdate = await this.model.findOne(this.getQuery());
  const oldPassword = docToUpdate.password;
  const newPassword = this._update.password;
  if (oldPassword !== newPassword) {
    var salt = bcrypt.genSaltSync(5);
    var hash = bcrypt.hashSync(newPassword, salt);
    this._update.password = hash;
    callback();
  }else{
    callback();
  }
});

ActorSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    console.log('verifying password in actorModel: ' + password);
    if (err) return cb(err);
    console.log('iMatch: ' + isMatch);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('Actors', ActorSchema);