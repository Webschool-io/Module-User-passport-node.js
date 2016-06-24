'use strict';

const AtomName = 'Email';

module.exports = {
  type: String
, validate: require('./../hadrons/'+AtomName.toLowerCase()+'ValidateMongoose')
, required: true
}