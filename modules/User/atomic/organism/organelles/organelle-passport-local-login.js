const LocalStrategy = require('passport-local').Strategy

module.exports = (Model) => {
  const Strategy = new LocalStrategy({
    //by default, local strategy uses username and password, we will override with email
    usernameField: 'email',  
    passwordField: 'password',  
    passReqToCallback : true
  }
  , function(req, email,password, done){ //callback with email and password from our form
    if (email)
      email = email.toLowerCase();

    process.nextTick(function(){
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      Model.findOne({'local.email': email}, function(err, user){
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
  })
  return Strategy
}