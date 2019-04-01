const router       = require('express').Router();
const seferModel   = require('../models/sefer');
const perekModel   = require('../models/perek');
const teacherModel = require('../models/teacher.js');

const ts = require('../models/tanach_study.js');
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
router.route('/tanach-study/:a?/:b?/:c?/:d?/:e?')
  .get(ts.setTanachStudy, utils.parseRequest, utils.runQueryOnDB, utils.sendAsJSON);
router.route('/parasha-study/:a?/:b?/:c?/:d?/:e?')
  .get(ps.setParashaStudy, utils.parseRequest, utils.getDataFromDB, utils.sendAsJSON);

module.exports = router;
