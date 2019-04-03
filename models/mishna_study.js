const { getDB } = require('../lib/dbConnection');

const { DB_NAME } = process.env;

function setMishnaStudy(req, res, next) {
  res.program = 'mishna_study';
  next();
}

function getMishnaStudyQueryObject(a, b, c, d, e) {
  const query = {};
  query.division = a.replace('-', '_');
  query.section = b;
  query.unit = c;
  if (d) {
    query.part = parseInt(d, 10);
  }
  return query;
}

function getMasechet(req, res, next) {
  const { seder, masechet } = req.params;
  const query = {
    division: 'mishna',
    segment: seder,
    section: masechet,
  };
  getDB().then((client) => {
    const db = client.db(DB_NAME);
    db.collection('newPerakim')
      .find(query, {
        _id: 0,
      })
      .toArray()
      .then((data) => {
        res.data = data;
        next();
      })
      .catch(findErr => next(findErr));
  })
    .catch(dbErr => next(dbErr));
}

module.exports = {
  setMishnaStudy,
  getMishnaStudyQueryObject,
  getMasechet,
};
