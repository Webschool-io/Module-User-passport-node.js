const mongoose  = require('mongoose');
const Molecule = require('../molecules/molecule-user');
const OrganismName = 'User'

module.exports = mongoose.model(OrganismName, Molecule)
