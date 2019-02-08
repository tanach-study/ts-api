const { getDB } = require('../lib/dbConnection');
const ts        = require('../models/tanach_study.js');
const ps        = require('../models/parasha_study.js');

const { DB_NAME } = process.env;

function sendAsJSON(req, res) {
  res.json(res.data);
}

function parseRequest(req, res, next) {
  const { a, b, c, d, e } = req.params;
  res.data = [res.program, a, b, c, d, e];
  const query = {};
  switch (res.program) {
    case 'tanach_study':
      ts.getTanachStudyQueryObject(a, b, c, d, e);
      break;
    case 'parasha_study':
      ps.getParashaStudyQueryObject(a, b, c, d, e);
      break;
    default:
      break;
  }
  res.queryObject = query;
  next();
}

function getDataFromDB(req, res, next) {
  getDB().then((client) => {
    const db = client.db(DB_NAME);
    db.collection('newPerakim')
      .find(res.queryObject, {
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
  sendAsJSON,
  parseRequest,
  getDataFromDB,
};
