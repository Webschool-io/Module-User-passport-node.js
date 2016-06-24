const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const generateHash = require('../quarks/quark-generateHash.js')
const isValidPassword = require('../quarks/quark-isValidPassword.js')

const local = require('./molecule-local')
const facebook = require('./molecule-facebook')
const github = require('./molecule-github')
const google = require('./molecule-google')
const twitter = require('./molecule-twitter')

const Structure = {
  local,
  facebook,
  twitter,
  google,
  github
}
const Molecule = mongoose.Schema(Structure);

Molecule.methods.generateHash = generateHash

Molecule.methods.validPassword = function(password) {
    return isValidPassword(password, this.local)
};

module.exports = Molecule;