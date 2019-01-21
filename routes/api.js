const router       = require('express').Router();
const seferModel   = require('../models/sefer');
const perekModel   = require('../models/perek');
const teacherModel = require('../models/teacher.js');

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
  next();
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
  .get(setTanachStudy, parseRequest, sendAsJSON);
router.route('/parasha-study/:a?/:b?/:c?/:d?/:e?')
  .get(setParashaStudy, parseRequest, sendAsJSON);

module.exports = router;
