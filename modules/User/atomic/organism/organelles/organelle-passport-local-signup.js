const LocalStrategy = require('passport-local').Strategy

module.exports = (Model) => {
  console.log('local-signup')
  const Strategy = new LocalStrategy({
    //by default, local strategy uses username and password, we will override with email
    usernameField: 'email',  
    passwordField: 'password',  
    passReqToCallback: true //allows us to pass back the entire request to the callback
  }, (req, email, password, done) => {
    if(email)
      email = email.toLowerCase(); //Use lower-case emails to avoid case-sensitives email matching

    const UserCreate = (Model, req) => {
      // se o usuário não está logado ainda.
      Model.findOne({ 'local.email': email}, function(err, user) {
        // se tiver erros, retornar os erros.
        if(err)return done(err)
        // verifica se já tem um usuário com esse email.
        if(user) return done(null,false,req.flash('signupMessage', 'That email is already taken.'))
        else {
          // create th user
          var newUser = {};
          //set the user's local credentials
          newUser.local = {}
          newUser.local.email = req.body.email
          newUser.local.password = require('../../quarks/quark-generateHash')(req.body.password)

          //save the user
          Model.create(newUser, function(err){
              if(err){
                console.log('err',err)
                throw new Error(err)
              }
              return done(null, Model)
          });
        }
      });
    }
    const UserExists = (Model, req) => {
       // ...presumably they're trying to connect a local account
       // BUT let's check if the email used to connect a local account is being used by another user
       Model.findOne({'local.email': email}, function(err, user){
         if(err)
          return done(err);

         if(user){
           return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
           // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
         } else {
           var user = req.user;
           user.local.email = email;
           user.local.password = user.generateHash(password);
           console.log('user', user)
           Model.create(user, function(err){
            if(err) return done(err);
            return done(null, user);
           });
         }
       });
    }
    //asynchornous
    process.nextTick(function() {
      if(!req.user) {
        UserCreate(Model, req)
      } else if (!req.user.local.email) {
        UserExists(Model, req)
      } else {
        // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
        return done(null, req.user);
      }
    });
  })
  return Strategy
}