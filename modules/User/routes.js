const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('index.ejs');
});

  router.get('/profile', isLoggedIn, function(req, res) {
      res.render('profile.ejs', {
          user: req.user //get the user out of session and pass to template.
      });
  });

  router.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/users');
  });    

  router.get('/login', function(req, res){       
      //render the page and pass in any flash data if it exists.
      res.render('login.ejs', {message: req.flash('loginMessage')});        
  });  
    
  //process the login form
  router.post('/login', passport.authenticate('local-login',{
        successRedirect: '/users/profile'
      ,  failureRedirect: '/users/login'
      ,  failureFlash   : true 
  }));

  router.get('/signup', function(req, res){
      //render the page and pass in any flash data if it exists.
      res.render('signup.ejs', {message: req.flash('signupMessage')});
  });
    
  //process the signup form
  router.post('/signup', passport.authenticate('local-signup', {
          successRedirect : '/users/profile' // redirect to the secure profile section
      ,   failureRedirect : '/users/signup' // redirect back to the signup page if there is an error
      ,   failureFlash    : true // allow flash messages
  }));


  // =====================================
  // FACEBOOK ROUTES =====================
  // =====================================
  // route for facebook authentication and login
  router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
  
  //  handle the callback after facebook has authenticated the user
  router.get('/auth/facebook/callback'
    , passport.authenticate('facebook', 
    {
        successRedirect: '/users/profile'
      , failureRedirect:  '/users/'
    }));
    
  // ===========================================
  // GITHUB ROUTES ===========================
  // ===========================================
  // route for github authentication and login      
  router.get('/auth/github'  
    , passport.authenticate('github', 
    {
        successRedirect: '/users/profile'
      , failureRedirect: '/users/'
    }));

  // =============================================================================
  // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
  // =============================================================================

  //locally ----------------------------------------------------------------------
  router.get('/connect/local', function(req,res){
    res.render('connect-local.ejs', {message:req.flash('loginMessage')});
  });

  router.post('/connect/local', passport.authenticate('local-signup', {
      successRedirect : '/users/profile' //redirect to the secure profile section
    , failureRedirect : '/users/connect/local' //redirect back to the signup page if there is an error
    , failureFlash    : true //allow flash messages
  }));

  //facebook ----------------------------------------------------------------------

  //send to facebook to do the authentication
  router.get('/connect/facebook', passport.authorize('facebook', {scope: 'email'}));

  //handle the callback after facebook has authorized the user
  router.get('/connect/facebook/callback'
      , passport.authorize('facebook', {
          successRedirect : '/profile'
        , failureRedirect : '/'
  }));

//route middleware to make sure a user is logged in
  function isLoggedIn(req, res,next){

    //if user is authenticated in the session carry on
    if(req.isAuthenticated())
    {
        return next();
    }

    //if they aren't edirect them to the home page.
    res.redirect('/');
  }


module.exports = router;
