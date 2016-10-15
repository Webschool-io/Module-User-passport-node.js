module.exports = (Organism) => {
  return (data, done) => {
    console.log('data findOneLogin', data)
    Organism.findOne({'email': data.email}, (err, user) => {
      console.log('user', user)
      //if there area any errors, return the error before anything else
      if(err)
        return done(err);
      //if no user is found, return the message
      if(!user)
        return done(null, false, {alert: 'Incorrect username.'}) // req.flash is the way to set flashdata using connect-flash
      // //all is well, return successful user.
      if(!user.validPassword(user, data.password))
        return done(null, false, {alert: 'Incorrect username.'}); //create the loginMessage and save it to session as flashData

      //all is well, return successful user
      console.log('done', done)
      return done(null, user);
    });
  }
}
