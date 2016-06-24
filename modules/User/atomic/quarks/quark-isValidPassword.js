const bcrypt = require('bcrypt')

module.exports = (password, local) => {
  return bcrypt.compareSync(password, local.password)
};

