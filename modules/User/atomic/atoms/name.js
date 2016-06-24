'use strict';

const AtomName = 'Name';

module.exports = {
  type: String
, validate: require('./../hadrons/'+AtomName.toLowerCase()+'ValidateMongoose')
, required: true
}