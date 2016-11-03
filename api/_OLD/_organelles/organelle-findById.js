const callback = (err, data, res) => {
  if (err) return console.log('Erro: ', err);
  return res(JSON.stringify(data));
};

module.exports = (Organism) => {
  return (req, res) => {
    const query = {_id: req};
    Organism.findOne(query, (err, data) => callback(err, data, res));
  }
};
