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
const userSchema = mongoose.Schema(Molecule);

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
```

Após essa separação vamos separar as estratégias de login em suas *Organelles* responsáveis, por exemplo:

- organelle-passport-local-login
- organelle-passport-local-signup
- organelle-passport-facebook
- organelle-passport-github

Porém antes disso iremos separar 2 *Quarks* do *Passport* que estão nessa parte:

```js
  //used to serialize the user for the session
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  //used to deserialize the user
  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
    done(err, user);
    });
  });
```

Separamos cada *callback* em um *Quark* diferente:

```js
// quark-passportSerializeUser
module.exports = () => (user, done) => done(null, user.id)
```

```js
// quark-passportDeserializeUser
module.exports = (Model) => (id, done) => Model.findById(id, (err, user) => done(err, user))
```

Esse último *Quark* ficou bem estranho não? Muita flechinha `=>` hahhahahahhaa mas vou explicar para você como eu cheguei nessa função, vamos analisar ela como estava antes;

```js
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
  done(err, user);
  });
});
```

Então quando passamos essa função para um módulo ela fica assim:


```js
module.exports = function (Model) { 
  return function (id, done)  { 
    Model.findById(id, function(err, user) {
       done(err, user)
    })
  }
}
```

Pois devemos exporta a função de *callback*, porém ela necessita do *Model* do `User`, que aqui chamamos apenas de `Model` para deixar o código mais genérico possível, deve ter percebido também que na função original existem `return`s pois as funções são assíncronas, mas isso não quer dizer que não podemos usar, deixando o código fica assim:

```js
module.exports = function (Model) { 
  return function (id, done)  { 
    return Model.findById(id, function(err, user) {
       return done(err, user)
    })
  }
}
```

**Pronto!** Agora basta passar para *arrow function*:

```js
module.exports = (Model) => { 
  return  (id, done) => { 
    return Model.findById(id, (err, user) => {
       return done(err, user)
    })
  }
}
```

E como sabemos que se a função retornar algo diretamente podemos suprimir o `return` e as `{ }` deixando apenas assim:

```js
module.exports = (Model) => (id, done) => Model.findById(id, (err, user) => done(err, user)
```

> Legal né?

Agora vamos ver como fica nosso código do `config/passport.js`:

```js
// load up the user model
const Model = require('../modules/User/model');

//load the auth variables
const configAuth = require('../modules/User/atomic/hadrons/hadron-authPassport');

// expose this function to our app using module.exports
module.exports = function(passport){

  //used to serialize the user for the session
  const serializeUser = require('../modules/User/atomic/quarks/quark-passportSerializeUser')();
  passport.serializeUser(serializeUser);

  //used to deserialize the user
  const deserializeUser = require('../modules/User/atomic/quarks/quark-passportDeserializeUser')(Model);
  passport.deserializeUser(deserializeUser);

  const localSignup = require('../modules/User/atomic/organism/organelles/organelle-passport-local-signup')(Model)
  passport.use('local-signup', localSignup)

  // LOCAL
  const localLogin = require('../modules/User/atomic/organism/organelles/organelle-passport-local-login')(Model)
  passport.use('local-login', localLogin);

  // FACEBOOK
  const facebookLogin = require('../modules/User/atomic/organism/organelles/organelle-passport-facebook')(Model)
  passport.use(facebookLogin);

  // GITHUB
  const githubLogin = require('../modules/User/atomic/organism/organelles/organelle-passport-github')(Model)
  passport.use(githubLogin);

};

```

**LISTAR AS ORGANELLES AQUI COM LINK PRO ARQUIVO**

Além disso modularizei o `configAuth` para seu *Hadron* responsável, pois como sabemos o *Hadron* é apenas uma estrutura, *na nossa arquitetura* que compõe 2 ou mais *Quarks*.

```js
//load the auth variables
const configAuth = require('../modules/User/atomic/hadrons/hadron-authPassport');
```

Deixando o `hadrons/hadron-authPassport` assim:

```js
module.exports = {
  'facebookAuth'      :{
      'clientID'      : process.env.facebookAuth_clientID
    , 'clientSecret'  : process.env.facebookAuth_clientSecret
    , 'callbackURL'   : 'http://localhost:8080/users/auth/facebook/callback'
  }
  ,'twitterAuth'        : {
      'consumerKey'     : 'your-consumer-key-here'
    , 'consumerSecret'  : 'your-client-secret-here'
    , 'callbackURL'     : 'http://localhost:8080/auth/twitter/callback'
  }
  ,'googleAuth'       :{
      'clientID'      : 'your-secret-clientID-here'
    , 'clientSecret'  : 'your-client-secret-here'
    , 'callbackURL'   :'http://localhost:8080/auth/google/callback'
  }
  ,'githubAuth': {
      'clientID'      : process.env.githubAuth_clientID
    , 'clientSecret'  : process.env.githubAuth_clientSecret
    , 'callbackURL'   : 'http://localhost:8080/users/auth/github/callback'
  }
};
```

Você deve estar se perguntando de onde vem esse `process.env` né?

**Então, eu criei um arquivo `.env` na raíz do projeto contendo a seguinte estrutura:**

```.env
facebookAuth_clientID=COLOQUE_SUA_CHAVE_AQUI
facebookAuth_clientSecret=COLOQUE_SUA_CHAVE_AQUI
githubAuth_clientID=COLOQUE_SUA_CHAVE_AQUI
githubAuth_clientSecret=COLOQUE_SUA_CHAVE_AQUI
```

E no nosso arquivo principal do servidor, nesse caso `server.js`, só precisamos adicionar a seguinte linha no seu início:

```
require('dotenv').config();
```

Que ele automagicamente irá colocar os valores contidos do `.env` na *global* `process.env`, com isso você poderá utilizar esses valores em qualquer arquivo e poderá deixar toda informação sensível nesse arquivo o qual **deve sempre**  ser colocado no `.gitignore`.

Agora nosso código já está **BEM MELHOR** porém nós ainda precisamos **refatorar** nosso *Model* de *User* que virará `organism/organism-user.js` assim:

```js
const mongoose  = require('mongoose');
const Molecule = require('../molecules/molecule-user.js');

module.exports = mongoose.model('User', Molecule);
```

E como você deve ter percebido nós precisamos refatorar o *Schema* para `molecules/molecule-user.js`:

```js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

//define the schema for our user model
const userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    github: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

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

Então vamos separar os objetos internos do `userSchema` para 1 molécula diferente para cada:

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
  email: String,
  name: String
}
```

Desse jeito deixamos nosso código **MUITO** menor:

```js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const generateHash = require('../quarks/quark-generateHash.js')
const isValidPassword = require('../quarks/quark-isValidPassword.js')

const local = require('./molecule-local')
const facebook = require('./molecule-facebook')
const github = require('./molecule-github')
const google = require('./molecule-google')
const twitter = require('./molecule-twitter')

const Structure = {
  local,
  facebook,
  twitter,
  google,
  github
}
const Molecule = mongoose.Schema(Structure);

Molecule.methods.generateHash = generateHash

Molecule.methods.validPassword = function(password) {
    return isValidPassword(password, this.local)
};

module.exports = Molecule;
```

E você também percebeu que modularizei os `methods` da `Molecule` para seus *Quarks* responsáveis:

```js
// quark-generateHash
const bcrypt = require('bcrypt')

module.exports = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
};
```

```js
// quark-isValidPassword
const bcrypt = require('bcrypt')

module.exports = (password, local) => {
  return bcrypt.compareSync(password, local.password)
};
```

Agora vamos atomizar as moléculas de cada estratégia, por exemplo o `molecule-local.js`:

```js
const email = require('../atoms/email')
const password = require('../atoms/password')

module.exports = {
  email,
  password
}
```

Onde temos seus ***Átomos*** `email` e `password`:

```js
// atoms/email.js
const AtomName = 'Email';

module.exports = {
  type: String
, validate: require('./../hadrons/'+AtomName.toLowerCase()+'ValidateMongoose')
, required: true
}
```

```js
// atoms/password.js
const AtomName = 'Password';

module.exports = {
  type: String
, validate: require('./../hadrons/'+AtomName.toLowerCase()+'ValidateMongoose')
, required: true
}
```

Onde cada 1 tem seu próprio *Hadron* para validar com o *Mongoose*:

```js
// hadrons/emailValidateMongoose
const QuarkName = 'Email';

module.exports = {
  validator: require('./../quarks/is'+QuarkName)
, message: require('./../quarks/is'+QuarkName+'Message')
};
```

```js
// hadrons/passwordValidateMongoose
const QuarkName = 'Password';

module.exports = {
  validator: require('./../quarks/is'+QuarkName)
, message: require('./../quarks/is'+QuarkName+'Message')
};
```

Os quais chamam seus *Quarks* para validar em `validator` e de mensagem de erro em `message`.

Porém aqui nós não estamos usando o *Quark* `isPassword` para validar se a senha existe no banco, ela testa apenas o tamanho da *String*:

```js
module.exports = (value) => {
  const isEmpty = require('./isEmpty')(value);
  const isString = require('./isString')(value);

  if(isEmpty) return false;
  if(!isString) return false;

  return (value.length > 6 && value.length < 20);
}
```

Pois o método que valida se a senha existe foi criado como função estática em:

```js
Molecule.methods.validPassword = function(password) {
    return isValidPassword(password, this.local)
};
```

Que é utilizado em `passport-local-login`:

```js
//all is well, return successful user.
if(!user.validPassword(password))
```

## Local

Vamos avalisar estratégia por estratégia, mais usadas, no Passport. Iniciando com o `local` pois é nele que criamos o usuário localmente caso ele não use nenhum login social.

### Signup
Agora vamos refatorar o arquivo `organelle-passport-local-signup`



