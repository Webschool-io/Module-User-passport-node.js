const express = require('express');
const router = express.Router();
const passport = require('passport');
const Controller = require("./organism");

// Create
router.post('/', (req, res, next) => {
  Controller.create(req, res);
});
// Retrieve
router.get('/', (req, res, next) => {
  Controller.find(req, res);
});
// get current user
router.get('/currentuser', isLoggedIn, (req, res) => {
  res.json(req.user);
});
// logout
router.get('/logout', (req, res) => {
  req.logout();
  res.status(200).send('Ok');
});
// get by id
router.get('/:id', (req, res, next) => {
  Controller.findById(req, res);
});
// get one
router.post('/find', (req, res, next) => {
  Controller.findOne(req, res);
});
// Update
router.put('/:id', (req, res, next) => {
  Controller.update(req, res);
});
// Delete
router.delete('/:id', (req, res, next) => {
  Controller.remove(req, res);
});
// login
router.post('/login', passport.authenticate('local-login'), function(req, res){
  res.json(req.user);
  res.end();
});



function isLoggedIn(req, res, next){
  if(req.isAuthenticated())
  {
    return next();
  };
  res.json({success: false});
}

module.exports = router;
