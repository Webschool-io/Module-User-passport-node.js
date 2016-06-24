const mongoose  = require('mongoose');
const userSchema = require('./schema');
//create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
