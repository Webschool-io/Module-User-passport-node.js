'use strict'

const QuarkName = 'Name';

module.exports = {
  validator: require('./../quarks/is'+QuarkName)
, message: require('./../quarks/is'+QuarkName+'Message')
};