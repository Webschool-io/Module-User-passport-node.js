module.exports = (Model) => (id, done) => Model.findById(id, (err, user) => done(err, user))
