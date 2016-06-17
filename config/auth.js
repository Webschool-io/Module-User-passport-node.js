module.exports = {
  'facebookAuth'      :{
      'clientID'      : 'your-consumer-key-here'
    , 'clientSecret'  : 'your-client-secret-here'
    , 'callbackURL'   : 'http://localhost:8080/users/auth/facebook/callback'
  }
  ,'twitterAuth'        : {
      'consumerKey'     : 'your-consumer-key-here'
    , 'consumerSecret'  : 'your-client-secret-here'
    , 'callbackURL'     : 'http://localhost:8080/auth/twitter/callback'
  }
  ,'googleAuth'       :{
      'clientID'      : 'your-secret-clientID-here'
    , 'clientSecret'  : 'your-client-secret-here'
    , 'callbackURL'   :'http://localhost:8080/auth/google/callback'
  }
  ,'githubAuth': {
      'clientID'      : 'your-consumer-key-here'
    , 'clientSecret'  : 'your-client-secret-here'
    , 'callbackURL'   : 'http://localhost:8080/users/auth/github/callback'
  }
};
