const mongoose = require('mongoose');

const isValidPassword = require('../../_quarks/quark-isValidPassword.js')

/* CRIA A ESTRUTURA DE AUTENTICAÇÃO */
const local = require('./molecules/molecule-local')
const facebook = require('./molecules/molecule-facebook')
const github = require('./molecules/molecule-github')
const google = require('./molecules/molecule-google')
const twitter = require('./molecules/molecule-twitter')
const auth = {
  local,
  facebook,
  twitter,
  google,
  github
}

/* MONTA A ESTRUTURA DA MODEL INCLUÍNDO A ESTRUTURA DE AUTENTICAÇÃO */
const name = require('./../../_atoms/atom-name');
const email = require('./../../_atoms/atom-email');
// const username = require('./../../_atoms/atom-name');
// const password = require('./../../_atoms/atom-password');
const created_at = { type: Date, default: Date.now };

const Structure = {
  name
, email
// , username
// , password
, created_at
, auth
}

const Molecule = mongoose.Schema(Structure);

Molecule.methods.validPassword = function(password) {
    return isValidPassword(password, this)
};

module.exports = Molecule;
