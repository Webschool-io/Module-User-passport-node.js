'use strict'

const AtomName = 'Email';

module.exports = {
	type: String
  , set: require('./../_quarks/toLower')
  , validate: require('./../_hadrons/'+AtomName.toLowerCase()+'MongooseValidade')
  // , required: true
}
