const router       = require('express').Router();
const seferModel   = require('../models/sefer');
const perekModel   = require('../models/perek');
const teacherModel = require('../models/teacher.js');
const { getDB }    = require('../lib/dbConnection');

const { DB_NAME } = process.env;

function sendAsJSON(req, res) {
  res.json(res.data);
}

function setTanachStudy(req, res, next) {
  res.program = 'tanach_study';
  next();
}

function setParashaStudy(req, res, next) {
  res.program = 'parasha_study';
  next();
}

function parseRequest(req, res, next) {
  const { a, b, c, d, e } = req.params;
  res.data = [res.program, a, b, c, d, e];
  const query = {};
  switch (res.program) {
    case 'tanach_study':
      // division is which part of tanach, e.g. neviim_rishonim
      // a is originally structrued with dashes since it's part of the URL, hence replacemnt
      query.division = a.replace('-', '_');
      // section is the book name in tanach, e.g. yehoshua
      // b also comes in with dashes
      query.section = b;
      // unit is the perek number in the book, e.g. '1'
      // c is originally a string, need to convert to int for db
      query.unit = parseInt(c, 10);
      if (d) {
        // part is used if a perek is split into multiple parts; is optional
        // if not specified, perakim where there are multiple should return an array of all
        query.part = d;
      }
      break;
    case 'parasha_study':
      query.division = a.replace('-', '_');
      query.section = b;
      query.unit = c;
      if (d) {
        query.part = parseInt(d, 10);
      }
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

router.route('/sefarim')
  .get(seferModel.getAllSefarim, sendAsJSON);

router.route('/sefarim/:sefer')
  .get(seferModel.getOneSefer, sendAsJSON);

router.route('/perakim/:sefer/:perek')
  .get(perekModel.getOnePerek, sendAsJSON);

router.route('/teachers')
  .get(teacherModel.getAllTeachers, sendAsJSON);

router.route('/teachers/:id')
  .get(teacherModel.getOneTeacher, sendAsJSON);

// requests should be in the form of /:program/:division/:segment/:section/:unit/:part
router.route('/tanach-study/:a?/:b?/:c?/:d?/:e?')
  .get(setTanachStudy, parseRequest, getDataFromDB, sendAsJSON);
router.route('/parasha-study/:a?/:b?/:c?/:d?/:e?')
  .get(setParashaStudy, parseRequest, getDataFromDB, sendAsJSON);

module.exports = router;
