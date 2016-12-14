var mongoose = require('mongoose');  
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({  
  userID: Number,
  isActivated: Boolean,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  isPasswordSet: Boolean,
  signupDate: { type: Date, default: Date.now },
  address1: String,
  address2: String,
  zipCode : String,
  city: String,
  country: String,
  individualAccount: Boolean,
  isPartOfClub: Boolean,
  club: Array,
  facebook_id: String,
  facebook_token: String,
  google_id: String,
  google_token: String,
  linkedin_id: String,
  linkedin_token: String
});

userSchema.methods.generateHash = function(password) {  
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function(password) {  
  return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('User', userSchema);