'use strict';

const express      = require('express');
const app          = express();
const port         = process.env.PORT || 8080;
const mongoose     = require('mongoose');
const passport     = require('passport');
const flash        = require('connect-flash');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');
const configDB     = require('./config/database.js');

const UserAPI = require('./modules/User/routes');

mongoose.connect(configDB.url);

require('./config/passport')(passport);


app.use(morgan('dev'));
app.use(cookieParser()); // read cookies (needed for auth) - TODO: mudar isso para JWT depois.
app.use(bodyParser());

app.set('view engine', 'ejs');

// required for passport
app.use(session({secret: 'MisterOfTretas'})); //session secret.
app.use(passport.initialize());
app.use(passport.session()); //persistent login session
app.use(flash()); // use connect-flash for flash messages stored in session.

app.use('/users', UserAPI)
// require('./app/routes.js')(app, passport); 

app.listen(port);
console.log('it works on port ' + port);
