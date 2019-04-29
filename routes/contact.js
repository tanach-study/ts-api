const router = require('express').Router();
const awsSES = require('../services/aws_ses.js');

function sendAsJSON(req, res) {
  res.json(res.data);
}

router.post('/', awsSES.sendEmail, sendAsJSON);

module.exports = router;
