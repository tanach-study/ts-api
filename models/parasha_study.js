function setParashaStudy(req, res, next) {
  res.program = 'parasha_study';
  next();
}

function getParashaStudyQueryObject(a, b, c, d, e) {
  const query = {};
  query.division = a.replace('-', '_');
  query.section = b;
  query.unit = c;
  if (d) {
    query.part = parseInt(d, 10);
  }
  return query;
}

module.exports = {
  setParashaStudy,
  getParashaStudyQueryObject,
};
