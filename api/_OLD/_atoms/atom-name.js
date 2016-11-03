'use strict'

const AtomName = 'Name';

module.exports = {
	type: String
  // , get: require('./../_quarks/toUpper')
  // , set: require('./../_quarks/toLower')
  , validate: require('./../_hadrons/'+AtomName.toLowerCase()+'MongooseValidade')
  // , required: true
}
