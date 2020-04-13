const router = require('express').Router();
const awsSES = require('../services/aws_ses.js');

function sendAsJSON(req, res) {
  res.json(res.data);
}

function sendEmail(req, res, next) {
  const e = awsSES.validateInput(req.body);
  if (e.status !== 200) {
    // we have an error, e is an Error object
    return next(e);
  }

  const { FROM_EMAIL, TO_EMAIL } = process.env;

  awsSES.sendEmail(req.body, FROM_EMAIL, TO_EMAIL)
    .then(info => {
      res.data = {
        status: 200,
      };
      return next();
    })
    .catch(err => {
      const respErr = new Error(err);
      respErr.status = 500;
      return next(respErr);
    });
}

router.post('/', sendEmail, sendAsJSON);

module.exports = router;
