# Module-User-passport-node.js
Módulo de login para o Passport utilizando nossa arquitetura atômica

Começamos a refatorar pelo `model.js` separando o *Schema* do *Model*, deixando o `schema.js` assim:

```js
// schema.js
const mongoose  = require('mongoose');
const bcrypt    = require('bcrypt-nodejs');

const Schema = mongoose.Schema;
const Molecule = {
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
}

//define the schema for our user model
const userSchema = mongoose.Schema();

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
```

E o `model.js` assim:

```js
const mongoose  = require('mongoose');
const userSchema = require('./schema');

module.exports = mongoose.model('User', userSchema);
```

Próximo passo é atomizar esse *Schema* separando em moléculas menores:

```js
// molecule
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;
const Molecule = {
  local: require('./molecule-local'),
  facebook: require('./molecule-facebook'),
  twitter: require('./molecule-twitter'),
  google: require('./molecule-google'),
  github: require('./molecule-github')
}

//define the schema for our user model
const userSchema = mongoose.Schema(Molecule);

//methods ========================
//generation a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if a password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = userSchema;
```

Onde cada tipo de molécula é 1 tipo diferente de login:

```js
// molecule-local
module.exports = {
  email: String,
  password: String
}
```

```js
// molecule-facebook
module.exports = {
  id: String,
  token: String,
  email: String,
  name: String
}
```

```js
// molecule-twitter
module.exports = {
  id: String,
  token: String,
  displayName: String,
  username: String
}
```

```js
// molecule-google
module.exports = {
  id: String,
  token: String,
  email: String,
  name: String
}
```

```js
// molecule-github
module.exports = {
  id: String,
  token: String,
  displayName: String,
  username: String
}
