// load up the user model
const Model = require('../modules/User/atomic/organism/organism-user');
// console.log('Model', Model)
//load the auth variables
const configAuth = require('../modules/User/atomic/hadrons/passwordAuthPassport');

// expose this function to our app using module.exports
module.exports = function(passport){
  const BASE_URl = '../modules/User/atomic'
  //used to serialize the user for the session
  const serializeUser = require(BASE_URl+'/quarks/quark-passportSerializeUser')();
  passport.serializeUser(serializeUser);

  //used to deserialize the user
  const deserializeUser = require(BASE_URl+'/quarks/quark-passportDeserializeUser')(Model);
  passport.deserializeUser(deserializeUser);

  const localSignup = require(BASE_URl+'/organism/organelles/organelle-passport-local-signup')(Model)
  passport.use('local-signup', localSignup)
  // LOCAL
  const localLogin = require(BASE_URl+'/organism/organelles/organelle-passport-local-login')(Model)
  passport.use('local-login', localLogin);

  // FACEBOOK
  const facebookLogin = require(BASE_URl+'/organism/organelles/organelle-passport-facebook')(Model)
  passport.use(facebookLogin);

  // GITHUB
  const githubLogin = require(BASE_URl+'/organism/organelles/organelle-passport-github')(Model)
  passport.use(githubLogin);

};
