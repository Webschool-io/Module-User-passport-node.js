'use strict'

const QuarkName = 'Email';

module.exports = {
  validator: require('./../quarks/is'+QuarkName)
, message: require('./../quarks/is'+QuarkName+'Message')
};