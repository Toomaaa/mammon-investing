var User = require('../models/user'); 

exports.finalize = function(req, res) {


	User.findOne({ 'email':  req.user.email }, function(err, user) {

		user.password = user.generateHash(req.body.password);
		user.isPasswordSet = true;
		user.firstName = req.body.firstName;
		user.lastName = req.body.lastName;
		user.address1 = req.body.address1;
		user.address2 = req.body.address2;
		user.zipCode = req.body.zipCode;
		user.city = req.body.city;
		user.country = req.body.country;

		user.save(function(err) {
			if(err)
				throw err;
			else {
				res.redirect('/app-home');
				return true;
			}
		});


	});

}
