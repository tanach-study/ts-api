const { getDB } = require('../lib/dbConnection');

function getOnePerek(req, res, next) {
  const { sefer, perek } = req.params;
  const queryPerek = String(parseInt(perek, 10)) === 'NaN' ? perek : parseInt(perek, 10);
  getDB().then((db) => {
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

module.exports = {
  getOnePerek,
};
