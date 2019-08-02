const { getDB } = require('../lib/dbConnection');

const { DB_NAME } = process.env;

function setTanachStudy(req, res, next) {
  res.program = 'tanach_study';
  next();
}

function getTanachStudyQueryObject(a, b, c, d, e) {
  const query = {};
  // division is which part of tanach, e.g. neviim_rishonim
  // a is originally structrued with dashes since it's part of the URL, hence replacemnt
  query.division = a.replace('-', '_');
  // section is the book name in tanach, e.g. yehoshua
  // b also comes in with dashes
  query.section = b;
  // unit is the perek number in the book, e.g. '1'
  // c is originally a string, need to convert to int for db
  // c can be null if request is for all parts in a book
  if (c && !Number.isNaN(parseInt(c, 10))) {
    query.unit = parseInt(c, 10);
  } else if (c) {
    query.unit = c;
  }
  if (d) {
    // part is used if a perek is split into multiple parts; is optional
    // if not specified, perakim where there are multiple should return an array of all
    query.part = d;
  }
  return query;
}

function getTanachStudyDistinctField(a, b, c, d, e) {
  if (a && b && !c) {
    return 'unit';
  }

  return null;
}

function getOnePerek(req, res, next) {
  const { sefer, perek } = req.params;
  const queryPerek = String(parseInt(perek, 10)) === 'NaN' ? perek : parseInt(perek, 10);

  getDB().then((client) => {
    const db = client.db(DB_NAME);
    db.collection('perakim')
      .findOne({
        book_name: sefer,
        perek_id: queryPerek,
      }, {
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

function getOnePerekNew(req, res, next) {
  const { sefer, perek } = req.params;
  // const queryPerek = String(parseInt(perek, 10)) === 'NaN' ? perek : parseInt(perek, 10);

  getDB().then((client) => {
    const db = client.db(DB_NAME);
    db.collection('newPerakim')
      .find({
        section: sefer,
        unit: perek,
      }, {
        projection: { _id: 0 },
      })
      .sort({ division_sequence: 1, section_sequence: 1, unit_sequence: 1, part_sequence: 1 })
      .toArray()
      .then((data) => {
        res.data = data;
        next();
      })
      .catch(findErr => next(findErr));
  })
    .catch(dbErr => next(dbErr));
}

function getAllSefarim(req, res, next) {
  getDB().then((client) => {
    const db = client.db(DB_NAME);
    db.collection('books')
      .find({}, { _id: 0 })
      .sort({ 'seferMeta.book_id': 1 })
      .toArray()
      .then((sefarim) => {
        res.data = sefarim;
        next();
      })
      .catch(findErr => next(findErr));
  })
    .catch(dbErr => next(dbErr));
}

function getOneSefer(req, res, next) {
  const { sefer } = req.params;
  getDB().then((client) => {
    const db = client.db(DB_NAME);
    db.collection('books')
      .findOne({ 'seferMeta.book_name': sefer }, { _id: 0 })
      .then((data) => {
        res.data = data;
        next();
      })
      .catch(findErr => next(findErr));
  })
    .catch(dbErr => next(dbErr));
}

function getOneSeferNew(req, res, next) {
  const { sefer } = req.params;
  getDB().then((client) => {
    const db = client.db(DB_NAME);
    db.collection('newPerakim')
      .find({ section: sefer }, { projection: { _id: 0 } })
      .sort({ unit_sequence: 1, part_sequence: 1 })
      .toArray()
      .then((data) => {
        res.data = data;
        next();
      })
      .catch(findErr => next(findErr));
  })
    .catch(dbErr => next(dbErr));
}

function getAllTeachers(req, res, next) {
  getDB().then((client) => {
    const db = client.db(DB_NAME);
    db.collection('teachers')
      .find({}, { _id: 0 })
      .sort({ 'teacher_info.lname': 1 })
      .toArray()
      .then((teachers) => {
        res.data = teachers;
        next();
      })
      .catch(findErr => next(findErr));
  })
    .catch(dbErr => next(dbErr));
}

function getOneTeacher(req, res, next) {
  const { id } = req.params;
  getDB().then((client) => {
    const db = client.db(DB_NAME);
    db.collection('teachers')
      .findOne({ 'teacher_info.teacher_id': parseInt(id, 10) }, { _id: 0 })
      .then((teacher) => {
        res.data = teacher;
        next();
      })
      .catch(findErr => next(findErr));
  })
    .catch(dbErr => next(dbErr));
}

module.exports = {
  setTanachStudy,
  getTanachStudyQueryObject,
  getTanachStudyDistinctField,
  getOnePerek: getOnePerekNew,
  getAllSefarim,
  getOneSefer: getOneSeferNew,
  getAllTeachers,
  getOneTeacher,
};
