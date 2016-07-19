const mongoose  = require('mongoose');
const Molecule = require('../molecules/molecule-user.js');

const OrganismName = 'User'
const Organism = mongoose.model(OrganismName, Molecule)

// Coloco os métodos estáticos do Schema no Model
Organism.generateHash = Molecule.generateHash
Organism.validPassword = Molecule.validPassword
console.log('Organism.generateHash', Organism.generateHash)
module.exports = Organism
