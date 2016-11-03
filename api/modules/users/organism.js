// 'use strict';
//
// const mongoose  = require('mongoose');
// const Molecule = require('./molecule');
// const OrganismName = 'Users';
//
// module.exports = mongoose.model(OrganismName, Molecule);
'use strict';

const DNA = {
	name: 'Users'
  , organelles: ['findOneLogin', 'findByIdDeserializeUser']
};

const Cell = require('./../../_factories/organism')(DNA);
module.exports = Cell;
