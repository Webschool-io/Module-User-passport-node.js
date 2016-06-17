// load all the things we need
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GithubStrategy = require('passport-github').Strategy;

// load up the user model
const User = require('../app/models/user');

//load the auth variables
const configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport){

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  //used to serialize the user for the session
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  //used to deserialize the user
  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
    done(err, user);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'
  passport.use('local-signup', new LocalStrategy({
        //by default, local strategy uses username and password, we will override with email
         usernameField: 'email'
      ,  passwordField: 'password'
      ,  passReqToCallback: true //allows us to pass back the entire request to the callback
  }
  , function(req, email, password, done) {
    if(email)
      email = email.toLowerCase(); //Use lower-case emails to avoid case-sensitives email matching

    //asynchornous
    process.nextTick(function() {
      if(!req.user) {
        // se o usuário não está logado ainda.
        User.findOne({ 'local.email': email}, function(err, user) {

          // se tiver erros, retornar os erros.
          if(err)
              return done(err);

          // verifica se já tem um usuário com esse email.
          if(user) {
              return done(null,false,req.flash('signupMessage', 'That email is already taken.'));
          } else {

            // create th user
            var newUser = new User();

            //set the user's local credentials
            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);

            //save the user
            newUser.save(function(err){
                if(err){
                    throw err;
                }
                return done(null, newUser);
            });
          }
        });
      } else if (!req.user.local.email) {
         // ...presumably they're trying to connect a local account
         // BUT let's check if the email used to connect a local account is being used by another user
         User.findOne({'local.email': email}, function(err, user){
           if(err)
            return done(err);

           if(user){
             return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
             // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
           } else {
             var user = req.user;
             user.local.email = email;
             user.local.password = user.generateHash(password);
             user.save(function(err){
               if(err)
                return done(err);

                return done(null, user);
             });
           }
         });
      } else {
        // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
        return done(null, req.user);
      }
    });
  }));

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
      //by default, local strategy uses username and password, we will override with email
         usernameField: 'email'
      ,  passwordField: 'password'
      ,  passReqToCallback : true

  }
  , function(req, email,password, done){ //callback with email and password from our form
    if (email)
      email = email.toLowerCase();

    process.nextTick(function(){
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({'local.email': email}, function(err, user){
        //if there area any errors, return the error before anything else
        if(err)
          return done(err);

        //if no user is found, return the message
        if(!user)
          return done(null, false,req.flash('loginMessage', 'No user found.')) // req.flash is the way to set flashdata using connect-flash

        //all is well, return successful user.
        if(!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password')); //create the loginMessage and save it to session as flashData

        //all is well, return successful user
        return done(null, user);
      });
    });
  }));

  // =========================================================================
  // FACEBOOK ================================================================
  // =========================================================================
  const facebookStrategy = {
    //pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
      clientSecret    : configAuth.facebookAuth.clientSecret,
      callbackURL     : configAuth.facebookAuth.callbackURL,
      profileFields   : ['id', 'name', 'email'],
      passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  };

  passport.use(new FacebookStrategy(facebookStrategy,
  //facebook will send back the token and profile
  function(req, token, refreshToken, profile, done){
    //asynchronous
    process.nextTick(function() {
      //check if the user is already logged in
      if(!req.user) {
        //find the user in the database based on their facebook  id
        User.findOne({'facebook.id': profile.id}, function(err, user) {
        //if there is an error, stop everything and return tha
        // ie an error connecting to the database
        if(err)
          return done(err);

        //if the user is found, then log them in
        if(user) {

          // if there is a user id already but no token (user was linked at one point and then removed)
          if(!user.facebook.token) {
            user.facebook.token = token;
            user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
            user.facebook.email = (profile.emails[0].value || '').toLowerCase();

            user.save(function(err){
              if(err)
                return done(err);

                return done(null, user);
            });
          }

          return done(null, user); //user found, return that user

        } else {
          //if there is no user found with that facebook id, create them
          var newUser = new User();

          //set all of the facebook information in our user model
          newUser.facebook.id    = profile.id; //set the users facebook id
          newUser.facebook.token = token; //we will save the token that facebook provides to the user
          newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see ow names are returned
          newUser.facebook.email = (profile.emails[0].value.value || '').toLowerCase(); //facebook can return multiple emails so we'll take the first

          //save our user to the database
          newUser.save(function(err){
            if(err)
              return done(err);

            //if successful, return the new user
            return done(null, newUser);
          });
        }
      });

      } else {
          //user already exists and is logged in, we have to link accounts
          var user = req.user; //pull the user out of the session

          //update the current users facebook credentials
          user.facebook.id    = profile.id;
          user.facebook.token = token;
          user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
          user.facebook.email = profile.emails[0].value;

          user.save(function(err){
            if(err) return done(err);

            return done(null, user);
          });
      }});
  }));

  // =========================================================================
  // GITHUB ================================================================
  // =========================================================================
  const githubStrategy = {
    //pull in our app id and secret from our auth.js file
      clientID        : configAuth.githubAuth.clientID,
      clientSecret    : configAuth.githubAuth.clientSecret,
      callbackURL     : configAuth.githubAuth.callbackURL,
      profileFields   : ['id', 'name', 'email'],
      passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
  };

  passport.use(new GithubStrategy(githubStrategy,
  function(req, token, refreshToken, profile, done){
    //asynchronous
    process.nextTick(function() {
      //check if the user is already logged in
      if(!req.user) {
        //find the user in the database based on their facebook  id
        User.findOne({'github.id': profile.id}, function(err, user) {
        //if there is an error, stop everything and return tha
        // ie an error connecting to the database
        if(err)
          return done(err);

        //if the user is found, then log them in
        if(user) {

          // if there is a user id already but no token (user was linked at one point and then removed)
          if(!user.github.token) {
            user.github.token = token;
            user.github.name = profile.name.givenName + ' ' + profile.name.familyName;
            user.github.email = (profile.emails[0].value || '').toLowerCase();

            user.save(function(err){
              if(err)
                return done(err);

                return done(null, user);
            });
          }

          return done(null, user); //user found, return that user

        } else {
          //if there is no user found with that facebook id, create them
          var newUser = new User();

          //set all of the facebook information in our user model
          newUser.github.id    = profile.id; //set the users facebook id
          newUser.github.token = token; //we will save the token that facebook provides to the user
          newUser.github.name  = profile.name;
          if (profile.email) {
            newUser.github.email = profile.email;
          }
          if (profile.avatar_url) {
            newUser.github.avatar = profile.avatar_url;
          }

          //save our user to the database
          newUser.save(function(err){
            if(err)
              return done(err);

            //if successful, return the new user
            return done(null, newUser);
          });
        }
      });

      } else {
          //user already exists and is logged in, we have to link accounts
          var user = req.user; //pull the user out of the session

          //update the current users facebook credentials
          user.github.id    = profile.id;
          user.github.token = token;
          user.github.name  = profile.name.givenName + ' ' + profile.name.familyName;
          user.github.email = profile.emails[0].value;

          user.save(function(err){
            if(err) return done(err);

            return done(null, user);
          });
      }});
  }));

};
