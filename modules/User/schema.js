const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt-nodejs');

//define the schema for our user model
const userSchema = mongoose.Schema({
  local               : {
           email      : String
          ,password   : String
  }
  ,facebook           : {
           id         : String
          ,token      : String
          ,email      : String
          ,name       : String
  }
  ,twitter             : {
           id          : String
          ,token       : String
          ,displayName : String
          ,username    : String
  }
  ,google              : {
           id          : String
          ,token       : String
          ,email       : String
          ,name        : String
  }
  ,github             : {
           id         : String
          ,token      : String
          ,email      : String
          ,name       : String
  }
});

//methods ========================
//generation a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if a password is valid
userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = userSchema;