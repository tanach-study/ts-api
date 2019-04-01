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

module.exports = {
  setTanachStudy,
  getTanachStudyQueryObject,
  getTanachStudyDistinctField,
};
