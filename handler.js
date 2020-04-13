'use strict';
const awsSES = require('./services/aws_ses.js');
const dotenv = require('dotenv');

function buildReturnObject(status, message) {
  return {
    statusCode: status,
    body: JSON.stringify({
      message: message,
    }),
  }
}

module.exports.contact = async event => {
  console.log('received event', event);
  const { body } = event || {};
  const reqBody = JSON.parse(body);
  console.log('received request with values', reqBody);

  const e = awsSES.validateInput(reqBody);
  if (e.status !== 200) {
    // we have an error, e is an Error object
    return buildReturnObject(e.status, e.message);
  }

  const { FROM_EMAIL, TO_EMAIL } = process.env;

  let info;
  try {
    info = await awsSES.sendEmail(reqBody, FROM_EMAIL, TO_EMAIL)
  }
  catch (err) {
    console.log('error sending email', err);
    return buildReturnObject(500, err.message);
  }

  console.log('sent email', info);
  return buildReturnObject(200, { status: 200 });
};
