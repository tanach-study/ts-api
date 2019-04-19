const router       = require('express').Router();
const seferModel   = require('../models/sefer');
const perekModel   = require('../models/perek');
const teacherModel = require('../models/teacher.js');

const ts = require('../models/tanach_study.js');
const ms = require('../models/mishna_study.js');
const ps = require('../models/parasha_study.js');
const utils = require('../models/utils.js');

// DEPRECATED
router.route('/sefarim')
  .get(seferModel.getAllSefarim, utils.sendAsJSON);

// DEPRECATED
router.route('/sefarim/:sefer')
  .get(seferModel.getOneSefer, utils.sendAsJSON);

// DEPRECATED
router.route('/perakim/:sefer/:perek')
  .get(perekModel.getOnePerek, utils.sendAsJSON);

router.route('/teachers')
  .get(teacherModel.getAllTeachers, utils.sendAsJSON);

router.route('/teachers/:id')
  .get(teacherModel.getOneTeacher, utils.sendAsJSON);

// requests should be in the form of /:program/:division/:segment/:section/:unit/:part
router.route('/tanach-study/teachers/:id')
  .get(ts.setTanachStudy, ts.getOneTeacher, utils.sendAsJSON);
router.route('/tanach-study/teachers')
  .get(ts.setTanachStudy, ts.getAllTeachers, utils.sendAsJSON);
router.route('/tanach-study/perakim/:sefer/:perek')
  .get(ts.setTanachStudy, ts.getOnePerek, utils.sendAsJSON);
router.route('/tanach-study/sefarim/:sefer')
  .get(ts.setTanachStudy, ts.getOneSefer, utils.sendAsJSON);
router.route('/tanach-study/:a?/:b?/:c?/:d?/:e?')
  .get(ts.setTanachStudy, utils.parseRequest, utils.runQueryOnDB, utils.sendAsJSON);

router.route('/mishna-study/mishna/:seder/:masechet/:perek/:mishna')
  .get(ms.setMishnaStudy, ms.getMishna, utils.sendAsJSON);
router.route('/mishna-study/perek/:seder/:masechet/:perek')
  .get(ms.setMishnaStudy, ms.getPerek, utils.sendAsJSON);
router.route('/mishna-study/masechet/:seder/:masechet')
  .get(ms.setMishnaStudy, ms.getMasechet, utils.sendAsJSON);
router.route('/mishna-study/schedule/today')
  .get(ms.setMishnaStudy, ms.getDate, utils.sendAsJSON);
router.route('/mishna-study/schedule/:date')
  .get(ms.setMishnaStudy, ms.getDate, utils.sendAsJSON);
router.route('/mishna-study/:a?/:b?/:c?/:d?/:e?')
  .get(ts.setTanachStudy, utils.parseRequest, utils.runQueryOnDB, utils.sendAsJSON);

router.route('/parasha-study/:a?/:b?/:c?/:d?/:e?')
  .get(ps.setParashaStudy, utils.parseRequest, utils.getDataFromDB, utils.sendAsJSON);

module.exports = router;
