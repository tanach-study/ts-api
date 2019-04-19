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

function getPerek(req, res, next) {
  const { seder, masechet, perek } = req.params;
  const query = {
    division: 'mishna',
    segment: seder,
    section: masechet,
    unit: parseInt(perek, 10),
  };
  getDB().then((client) => {
    const db = client.db(DB_NAME);
    db.collection('newPerakim')
      .find(query, {
        _id: 0,
      })
      .sort({ part_sequence: 1 })
      .toArray()
      .then((data) => {
        res.data = data;
        next();
      })
      .catch(findErr => next(findErr));
  })
    .catch(dbErr => next(dbErr));
}

function getMishna(req, res, next) {
  const { seder, masechet, perek, mishna } = req.params;
  const query = {
    division: 'mishna',
    segment: seder,
    section: masechet,
    unit: parseInt(perek, 10),
    part: parseInt(mishna, 10),
  };
  getDB().then((client) => {
    const db = client.db(DB_NAME);
    db.collection('newPerakim')
      .findOne(query, {
        _id: 0,
      })
      .then((data) => {
        res.data = data;
        next();
      })
      .catch(findErr => next(findErr));
  })
    .catch(dbErr => next(dbErr));
}

function getDate(req, res, next) {
  const { date } = req.params;
  // if date not specified default to current date
  const d = date ? new Date(date) : new Date();
  d.setHours(0, 0, 0, 0);
  const query = {
    division: 'mishna',
    date: d,
  };
  getDB().then((client) => {
    const db = client.db(DB_NAME);
    db.collection('schedule')
      .findOne(query, {
        _id: 0,
      })
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
  getPerek,
  getMishna,
  getDate,
};
