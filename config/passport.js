// load up the user model
const Model = require('../modules/User/model');

//load the auth variables
const configAuth = require('../modules/User/atomic/hadrons/passwordAuthPassport');

// expose this function to our app using module.exports
module.exports = function(passport){

  //used to serialize the user for the session
  const serializeUser = require('../modules/User/atomic/quarks/quark-passportSerializeUser')();
  passport.serializeUser(serializeUser);

  //used to deserialize the user
  const deserializeUser = require('../modules/User/atomic/quarks/quark-passportDeserializeUser')(Model);
  passport.deserializeUser(deserializeUser);

  const localSignup = require('../modules/User/atomic/organism/organelles/organelle-passport-local-signup')(Model)
  passport.use('local-signup', localSignup)

  // LOCAL
  const localLogin = require('../modules/User/atomic/organism/organelles/organelle-passport-local-login')(Model)
  passport.use('local-login', localLogin);

  // FACEBOOK
  const facebookLogin = require('../modules/User/atomic/organism/organelles/organelle-passport-facebook')(Model)
  passport.use(facebookLogin);

  // GITHUB
  const githubLogin = require('../modules/User/atomic/organism/organelles/organelle-passport-github')(Model)
  passport.use(githubLogin);

};
