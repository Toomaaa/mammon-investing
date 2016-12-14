var mongoose = require('mongoose');  
var bcrypt   = require('bcrypt-nodejs');

var clubsSchema = mongoose.Schema({  
  clubCode: String,
  clubName: String,
  initialAmount: Number,
  monthlyAmount: Number,
  shareAmount: Number,
  creationDate: Date,
  exitPercentage: Number,
  members: Array,
  president: Object,
  treasurer: Object,
  pendingApproval: Array
});

clubsSchema.methods.generateHash = function(password) {  
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
clubsSchema.methods.validPassword = function(password) {  
  return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('Club', clubsSchema);