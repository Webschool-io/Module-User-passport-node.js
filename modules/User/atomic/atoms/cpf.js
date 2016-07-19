'use strict';

const AtomName = 'CPF';

module.exports = {
  type: String
, validate: require('./../hadrons/'+AtomName.toLowerCase()+'ValidateMongoose')
, default: '04864713901'
}