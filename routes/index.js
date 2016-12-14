var express = require('express');  
var passport = require('passport');  
var passportComplement = require('../config/passport-complement');
var User = require('../models/user');  
var Club = require('../models/club');  
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

var router = express.Router();

router.get('/', function(req, res, next) {  
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {  
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {  
  res.render('signup.ejs', { message: req.flash('signupMessage') });
});



router.get('/finalize', function(req, res) {  
  res.render('finalize.ejs', { user: req.user });
});

router.get('/profile', isLoggedIn, function(req, res) {  
  res.render('profile.ejs', { user: req.user });
});


router.get('/logout', function(req, res) {  
  req.logout();
  res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {  
  successRedirect: '/app-home',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {  
  successRedirect: '/app-home',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.post('/finalize', function(req, res) {
  passportComplement.finalize(req, res);
});


// Facebook routes
router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {  
  successRedirect: '/app-home',
  failureRedirect: '/',
}));


// Google routes
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {  
  successRedirect: '/app-home',
  failureRedirect: '/',
}));


// Linkedin routes
router.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }),
  function(req, res){
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
  });

router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {  
  successRedirect: '/app-home',
  failureRedirect: '/',
}));



router.get('/club-signup', function(req, res) {  
  res.render('club-signup.ejs', { message: req.flash('loginMessage') });
});

router.post('/club-signup', function(req, res) {

  var clubCode = generateClubCode();


  var members = [];
  if(req.body.firstName1 != "" && req.body.lastName1 != "" && req.body.function1 != "" && req.body.email1 != "")
    members.push({ firstName: req.body.firstName1 , lastName: req.body.lastName1 , function: req.body.function1 , email: req.body.email1 });
  if(req.body.firstName2 != "" && req.body.lastName2 != "" && req.body.function2 != "" && req.body.email2 != "")
    members.push({ firstName: req.body.firstName2 , lastName: req.body.lastName2 , function: req.body.function2 , email: req.body.email2 });
  if(req.body.firstName3 != "" && req.body.lastName3 != "" && req.body.function3 != "" && req.body.email3 != "")
    members.push({ firstName: req.body.firstName3 , lastName: req.body.lastName3 , function: req.body.function3 , email: req.body.email3 });
  if(req.body.firstName4 != "" && req.body.lastName4 != "" && req.body.function4 != "" && req.body.email4 != "")
    members.push({ firstName: req.body.firstName4 , lastName: req.body.lastName4 , function: req.body.function4 , email: req.body.email4 });
  if(req.body.firstName5 != "" && req.body.lastName5 != "" && req.body.function5 != "" && req.body.email5 != "")
    members.push({ firstName: req.body.firstName5 , lastName: req.body.lastName5 , function: req.body.function5 , email: req.body.email5 });
  if(req.body.firstName6 != "" && req.body.lastName6 != "" && req.body.function6 != "" && req.body.email6 != "")
    members.push({ firstName: req.body.firstName6 , lastName: req.body.lastName6 , function: req.body.function6 , email: req.body.email6 });
  if(req.body.firstName7 != "" && req.body.lastName7 != "" && req.body.function7 != "" && req.body.email7 != "")
    members.push({ firstName: req.body.firstName7 , lastName: req.body.lastName7 , function: req.body.function7 , email: req.body.email7 });
  if(req.body.firstName8 != "" && req.body.lastName8 != "" && req.body.function8 != "" && req.body.email8 != "")
    members.push({ firstName: req.body.firstName8 , lastName: req.body.lastName8 , function: req.body.function8 , email: req.body.email8 });
  if(req.body.firstName9 != "" && req.body.lastName9 != "" && req.body.function9 != "" && req.body.email9 != "")
    members.push({ firstName: req.body.firstName9 , lastName: req.body.lastName9 , function: req.body.function9 , email: req.body.email9 });
  if(req.body.firstName10 != "" && req.body.lastName10 != "" && req.body.function10 != "" && req.body.email10 != "")
    members.push({ firstName: req.body.firstName10 , lastName: req.body.lastName10 , function: req.body.function10 , email: req.body.email10 });
  if(req.body.firstName11 != "" && req.body.lastName11 != "" && req.body.function11 != "" && req.body.email11 != "")
    members.push({ firstName: req.body.firstName11 , lastName: req.body.lastName11 , function: req.body.function11 , email: req.body.email11 });
  if(req.body.firstName12 != "" && req.body.lastName12 != "" && req.body.function12 != "" && req.body.email12 != "")
    members.push({ firstName: req.body.firstName12 , lastName: req.body.lastName12 , function: req.body.function12 , email: req.body.email12 });
  if(req.body.firstName13 != "" && req.body.lastName13 != "" && req.body.function13 != "" && req.body.email13 != "")
    members.push({ firstName: req.body.firstName13 , lastName: req.body.lastName13 , function: req.body.function13 , email: req.body.email13 });
  if(req.body.firstName14 != "" && req.body.lastName14 != "" && req.body.function14 != "" && req.body.email14 != "")
    members.push({ firstName: req.body.firstName14 , lastName: req.body.lastName14 , function: req.body.function14 , email: req.body.email14 });
  if(req.body.firstName15 != "" && req.body.lastName15 != "" && req.body.function15 != "" && req.body.email15 != "")
    members.push({ firstName: req.body.firstName15 , lastName: req.body.lastName15 , function: req.body.function15 , email: req.body.email15 });
  if(req.body.firstName16 != "" && req.body.lastName16 != "" && req.body.function16 != "" && req.body.email16 != "")
    members.push({ firstName: req.body.firstName16 , lastName: req.body.lastName16 , function: req.body.function16 , email: req.body.email16 });
  if(req.body.firstName17 != "" && req.body.lastName17 != "" && req.body.function17 != "" && req.body.email17 != "")
    members.push({ firstName: req.body.firstName17 , lastName: req.body.lastName17 , function: req.body.function17 , email: req.body.email17 });
  if(req.body.firstName18 != "" && req.body.lastName18 != "" && req.body.function18 != "" && req.body.email18 != "")
    members.push({ firstName: req.body.firstName18 , lastName: req.body.lastName18 , function: req.body.function18 , email: req.body.email18 });
  if(req.body.firstName19 != "" && req.body.lastName19 != "" && req.body.function19 != "" && req.body.email19 != "")
    members.push({ firstName: req.body.firstName19 , lastName: req.body.lastName19 , function: req.body.function19 , email: req.body.email19 });
  if(req.body.firstName20 != "" && req.body.lastName20 != "" && req.body.function20 != "" && req.body.email20 != "")
    members.push({ firstName: req.body.firstName20 , lastName: req.body.lastName20 , function: req.body.function20 , email: req.body.email20 });


  members.forEach(function(member) {

    User.find({ email: member.email }, function(err, userFound) {

      if (err)  throw err;

      if(userFound.length == 0) {
        var newUser = new User();
        newUser.isActivated = false;
        newUser.firstName = member.firstName;
        newUser.lastName = member.lastName;
        newUser.email = member.email;
        newUser.isPartOfClub = true;
        newUser.club = [ { clubCode : clubCode, status: 'Approved', function: member.function } ]
        newUser.save(function(err) {
          if(err) throw err;
        });
      }

    });

  });


  var newClub = new Club();
  newClub.clubCode = clubCode;
  newClub.clubName = req.body.clubName;
  newClub.initialAmount = req.body.initialAmount;
  newClub.monthlyAmount = req.body.monthlyAmount;
  newClub.shareAmount = req.body.shareAmount;
  newClub.creationDate = req.body.creationDate;
  newClub.exitPercentage = req.body.exitPercentage;
  newClub.members = members.filter(filterMembers);
  newClub.president = members.filter(filterPresident)[0];
  newClub.treasurer = members.filter(filterTreasurer)[0];
  newClub.save(function(err) {
    if (err)
      throw err;
  });
});



router.get('/app-home', isLoggedIn, function(req, res) {

  Club.findOne({ clubCode: req.user.club[0].clubCode }, function(err, clubFound) {
    if (err)  throw err;

    var userClub = req.user.club.find(function(element) { 
      return element.clubCode == clubFound.clubCode;
    });
    role = userClub.function;
    myCache.set( "role" , userClub.function);
    myCache.set( "club", clubFound);
    res.render('app-home.ejs', {user : req.user, club : clubFound, role: role });
  });
});


router.get('/members-list', isLoggedIn, function(req, res) {

  var club = myCache.get("club");
  var role = myCache.get("role");
  var user = req.user;

  // console.log("====================================================");
  // console.log("club :");
  // console.log(club);
  // console.log("====================================================");
  // console.log("user :");
  // console.log(user);

  // console.log(club.pendingApproval.find(function(element){ return element.email == user.email }));

  res.render('members-list.ejs', {user : req.user, club : club, role : role });
});


router.get('/member-approve/:memberIndex/:clubCode/:requesterIndex', function(req, res) {
  User.update({ userID : req.params.memberIndex, "club.clubCode" : req.params.clubCode }, { $set : { "club.$.status" : "Approved", "club.$.function" : "member" } }, function(err, numAffected) {
    res.send("OK");
  });

  // User.findOneAndUpdate({ userID : req.params.memberIndex, "club.clubCode" : req.params.clubCode }, req.newData, {upsert:true}, function(err, doc){
  //   if (err) return res.send(500, { error: err });
  //   return res.send("succesfully saved");
  // });
});



// /member-approve/3/5K8H0/4






// db.users.update({ userID : 3, "club.clubCode" : 5K8H0 }, { $set : { "club.$.status" : "Approved", "club.$.function" : "member" } });




module.exports = router;

function isLoggedIn(req, res, next) {  
  if (req.isAuthenticated()) {
    if(
        req.user.firstName &&
        req.user.lastName &&
        req.user.email &&
        req.user.isPasswordSet == true &&
        req.user.address1 &&
        req.user.zipCode &&
        req.user.city &&
        req.user.country
      ) {
      return next();
    }
    res.redirect('/finalize');
  }
  else {
    res.redirect('/');
  }
}


function generateClubCode()
{
    var code = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for( var i=0; i < 5; i++ )
        code += possible.charAt(Math.floor(Math.random() * possible.length));

    Club.find({ clubCode: code }, function(err, clubFound) {

      if (err)  throw err;

      if(clubFound.length > 0) return code;
      else generateClubCode();

    });

    return code;
}


function filterMembers (element) {
  return element.function == 'member';
}

function filterTreasurer (element) {
  return element.function == 'treasurer';
}

function filterPresident (element) {
  return element.function == 'president';
}