'use strict'

const AtomName = 'Password';

module.exports = {
  type: String
, validate: require('./../hadrons/'+AtomName.toLowerCase()+'ValidateMongoose')
, required: true
}