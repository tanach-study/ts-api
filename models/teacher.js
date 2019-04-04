const { getDB } = require('../lib/dbConnection');

const { DB_NAME } = process.env;

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
  getAllTeachers,
  getOneTeacher,
};
