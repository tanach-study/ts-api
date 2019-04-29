const nodemailer = require('nodemailer');
const aws = require('aws-sdk');
const { isValidEmail } = require('../lib/lib.js');

const { FROM_EMAIL, TO_EMAIL } = process.env;

const mailer = nodemailer.createTransport({
  SES: new aws.SES({
    apiVersion: '2010-12-01',
  }),
});

function sendEmailWithNodemailer(req, res, next) {
  const { name, email, subject, message } = req.body;
  if (!(name && email && subject && message)) {
    const err = new Error('Please fill out all the fields.');
    err.status = 422;
    return next(err);
  }
  if (!isValidEmail(email)) {
    const err = new Error('Invalid email.');
    err.status = 422;
    return next(err);
  }

  const wrapped = `
    ${message}
    <br />
    <p>-- ${name}</p>
  `;

  mailer.sendMail({
    from: `${name} <${FROM_EMAIL}>`,
    replyTo: email,
    to: TO_EMAIL,
    subject,
    html: wrapped,
  }, (err, info) => {
    if (err) {
      const respErr = new Error(err);
      respErr.status = 500;
      return next(respErr);
    }
    res.data = {
      status: 200,
    };
    return next();
  });
  return true;
}

module.exports = {
  sendEmail: sendEmailWithNodemailer,
};
