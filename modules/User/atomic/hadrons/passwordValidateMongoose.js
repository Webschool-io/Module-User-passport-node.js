'use strict'

const QuarkName = 'Password';

module.exports = {
  validator: require('./../quarks/is'+QuarkName)
, message: require('./../quarks/is'+QuarkName+'Message')
};