const DNA = {
	name: 'Users'
, organelles: ['findOneLogin', 'findByIdDeserializeUser']
}

const Cell = require('./../../_factories/organism')(DNA)
module.exports = Cell
