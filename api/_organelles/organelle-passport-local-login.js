const LocalStrategy = require('passport-local').Strategy

module.exports = (Model) => {

  const Strategy = new LocalStrategy({
    //by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
  }
  , function(req, email, password, done){ //callback with email and password from our form
    if (email)
      email = email.toLowerCase();

    process.nextTick(function(){
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      Model.findOneLogin({'email': email, 'password': password}, done);
    });
  })
  return Strategy
}
