/*jshint node:true*/
'use strict';

require('dotenv').config();
const db           = require('./_config/db');
const express      = require('express');
const app          = express();
const port         = process.env.PORT || 8080;
const passport     = require('passport');
const flash        = require('connect-flash');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');
const cors         = require('cors');
const compress     = require('compression');
const favicon      = require('serve-favicon');

require('./_config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(compress());            // Compress response data with gzip
app.use(favicon(__dirname + '/favicon.ico'));


// required for passport
app.use(session({secret: 'YcloudStartJob'})); //session secret.
app.use(passport.initialize());
app.use(passport.session()); //persistent login session
app.use(flash());

// let api = {};
// api.users = require('./modules/users/routes');
// app.use('/api/users', api.users);

/* Cria as rotas dinamicamente a partir dos módulos */
let api = {};
let modules = require('./getModules');

const createRoutes = (element, index) => {
    api[element] = require('./modules/'+element+'/routes');
    app.use('/api/'+element, api[element]);
};

modules.forEach(createRoutes);
/* Cria as rotas dinamicamente a partir dos módulos */


app.get('/ping', function(req, res, next) {
    console.log(req.body);
    res.send('pong');
});

app.listen(port, function() {
    console.log('---------------------------------------------------------------------------');
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd());
    console.log('---------------------------------------------------------------------------');
});
