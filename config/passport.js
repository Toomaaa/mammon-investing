var LocalStrategy = require('passport-local').Strategy;   
var FacebookStrategy = require('passport-facebook').Strategy;  
var TwitterStrategy = require('passport-twitter').Strategy;  
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;   
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var User = require('../models/user');  
var Club = require('../models/club');  
var configAuth = require('./auth'); 


var make_passwd = function(n) {
  var a = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
  var index = (Math.random() * (a.length - 1)).toFixed(0);
  return n > 0 ? a[index] + make_passwd(n - 1, a) : '';
};

module.exports = function(passport) {  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      // User.findOne({ 'local.email':  email }, function(err, user) {
      User.findOne({ 'email':  email }, function(err, user) {
        if (err)
            return done(err);
        if (user && user.isActivated == true) {
          return done(null, false, req.flash('signupMessage', 'That email is already in use.'));
        } else if(user && user.isActivated == false) {
          // console.log("count beginnning");
          // User.count({}, function(err, c) {
          //   user.userID = c;
          //   console.log(user.userID);
          // });
          // console.log("count ending");
          user.isActivated = true;
          user.password = user.generateHash(password);
          user.isPasswordSet = true;
          //
          user.firstName = req.body.firstName;
          user.lastName = req.body.lastName;
          user.address1 = req.body.address1;
          user.address2 = req.body.address2;
          user.zipCode = req.body.zipCode;
          user.city = req.body.city;
          user.country = req.body.country;
          
          if(req.body.clubCode != '') {
            Club.findOne({ clubCode: req.body.clubCode }, function(err, clubFound) {
              if (err)  throw err;

              if(clubFound == undefined){
                return done(null, false, req.flash('signupMessage', 'Le club demandé n\'existe pas.'));
              } 
              else { // {

                // Si le club n'est pas déjà associé à l'utilisateur, c'est un nouveau club, on l'ajoute (push)
                if (user.club.find(function (element) { return element.clubCode == req.body.clubCode }) == undefined)
                  user.club = [ { clubCode : req.body.clubCode, status : 'Pending Approval', function : 'pending' } ];
                // sinon c'est le même club donc on ne touche à rien
                else {}

                user.isPartOfClub = true;
                if(clubFound.pendingApproval) { clubFound.pendingApproval.push({firstName : user.firstName, lastName : user.lastName, email : user.email, function : 'member' }); }
                else clubFound.pendingApproval = [ {firstName : user.firstName, lastName : user.lastName, email : user.email, function : 'member' } ];
                clubFound.save(function(err2) {
                  if(err2) throw err2;
                });

                user.save(function(err) {
                  if (err)
                    throw err;
                  return done(null, user);
                });
              }
            });
          }
          else {
            user.save(function(err) {
              if (err)
                throw err;
              return done(null, user);
            });
          }

        } else {

          var newUser = new User();
          // console.log("count beginnning");
          // User.count({}, function(err, c) {
          //   user.userID = parseInt(c);
          //   console.log(user.userID);
          // });
          // console.log("count ending");
          newUser.isActivated = true;
          newUser.email = email;
          newUser.password = newUser.generateHash(password);
          newUser.isPasswordSet = true;
          //
          newUser.firstName = req.body.firstName;
          newUser.lastName = req.body.lastName;
          newUser.address1 = req.body.address1;
          newUser.address2 = req.body.address2;
          newUser.zipCode = req.body.zipCode;
          newUser.city = req.body.city;
          newUser.country = req.body.country;
          
          if(req.body.clubCode != '') {
            Club.findOne({ clubCode: req.body.clubCode }, function(err, clubFound) {
              if (err)  throw err;

              if(clubFound == undefined){
                return done(null, false, req.flash('signupMessage', 'Le club demandé n\'existe pas.'));
              } 
              else {
                newUser.club = [ { clubCode : req.body.clubCode, status : 'Pending Approval', function : 'pending' } ];
                newUser.isPartOfClub = true;
                if(clubFound.pendingApproval) { clubFound.pendingApproval.push({firstName : newUser.firstName, lastName : newUser.lastName, email : newUser.email, function : 'member' }); }
                else clubFound.pendingApproval = [ {firstName : newUser.firstName, lastName : newUser.lastName, email : newUser.email, function : 'member' } ];
                clubFound.save(function(err2) {
                  if(err2) throw err2;
                });

                newUser.save(function(err) {
                  if (err)
                    throw err;
                  return done(null, newUser);
                });
              }
            });
          }
          else {
            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
          
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email, password, done) {
    // User.findOne({ 'local.email':  email }, function(err, user) {
    User.findOne({ 'email':  email }, function(err, user) {
      if (err)
          return done(err);
      if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));
      if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Wrong password.'));
      return done(null, user);
    });
  }));


  passport.use(new FacebookStrategy({  
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'first_name', 'last_name'],
  },
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      // User.findOne({ 'facebook.id': profile.id }, function(err, user) {
      User.findOne({ 'email':  (profile.emails[0].value || '').toLowerCase() }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          user.facebook_id = profile.id;
          user.facebook_token = token;
          user.save(function(err) {
            if (err)
              throw err;
            return done(null, user);
          });
        } else {
          var newUser = new User();
          newUser.isActivated = true;
          newUser.facebook_id = profile.id;
          newUser.facebook_token = token;
          newUser.firstName = profile.name.givenName;
          newUser.lastName = profile.name.familyName;
          newUser.email = (profile.emails[0].value || '').toLowerCase();
          newUser.password = newUser.generateHash(make_passwd(20));
          newUser.isPasswordSet = false;

          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));


  passport.use(new GoogleStrategy({  
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,
  },
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      // User.findOne({ 'google.id': profile.id }, function(err, user) {
      User.findOne({ 'email': profile.emails[0].value }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          user.google_id = profile.id;
          user.google_token = token;
          user.save(function(err) {
            if (err)
              throw err;
            return done(null, user);
          });
        } else {
          var newUser = new User();
          newUser.isActivated = true;
          newUser.google_id = profile.id;
          newUser.google_token = token;
          newUser.firstName = profile.name.givenName;
          newUser.lastName = profile.name.familyName;
          newUser.email = profile.emails[0].value;
          newUser.password = newUser.generateHash(make_passwd(20));
          newUser.isPasswordSet = false;
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));


  passport.use(new LinkedInStrategy({
    clientID: configAuth.LinkedinAuth.clientID,
    clientSecret: configAuth.LinkedinAuth.clientSecret,
    callbackURL: configAuth.LinkedinAuth.callbackURL,
    scope: ['r_emailaddress', 'r_basicprofile'],
  }, function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's LinkedIn profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the LinkedIn account with a user record in your database,
      // and return that user instead.


      User.findOne({ 'email': profile.emails[0].value }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          user.linkedin_id = profile.id;
          user.linkedin_token = accessToken;
          user.save(function(err) {
            if (err)
              throw err;
            return done(null, user);
          });
        } else {
          var newUser = new User();
          newUser.isActivated = true;
          newUser.linkedin_id = profile.id;
          newUser.linkedin_token = accessToken;
          newUser.firstName = profile.name.givenName;
          newUser.lastName = profile.name.familyName;
          newUser.email = profile.emails[0].value;
          newUser.password = newUser.generateHash(make_passwd(20));
          newUser.isPasswordSet = false;
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });



      //
      //return done(null, profile);
    });
  }));

};