const router = require('express').Router();
const gmailService = require('../services/gmail.js');

function sendAsJSON(req, res) {
  res.json(res.data);
}

router.post('/', gmailService.getAuthObject, gmailService.generateEmailString, gmailService.sendEmail, sendAsJSON);

module.exports = router;
