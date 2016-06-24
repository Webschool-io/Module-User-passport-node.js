const mongoose  = require('mongoose');
const Molecule = require('../molecules/molecule-user.js');

module.exports = mongoose.model('User', Molecule);
