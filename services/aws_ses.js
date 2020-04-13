const nodemailer = require('nodemailer');
const aws = require('aws-sdk');
const { isValidEmail } = require('../lib/lib.js');

let mailerSingleton = null;

function initMailer() {
  if (!!mailerSingleton) {
    return mailerSingleton;
  }

  mailerSingleton = nodemailer.createTransport({
    SES: new aws.SES({
      apiVersion: '2010-12-01',
    }),
  });
  return mailerSingleton;
}

function validateInput({ name, email, subject, message }) {
  console.log('validating input', name, email, subject, message);
  if (!(name && email && subject && message)) {
    const err = new Error('Please fill out all the fields.');
    err.status = 422;
    return err;
  }

  if (!isValidEmail(email)) {
    const err = new Error('Invalid email.');
    err.status = 422;
    return err;
  }

  return { status: 200 };
}

function sendEmailWithNodemailer({ name, email, subject, message }, FROM_EMAIL, TO_EMAIL) {
  console.log('sending email', name, email, subject, message, FROM_EMAIL, TO_EMAIL);
  const wrapped = `
    ${message}
    <br />
    <p>-- ${name}</p>
  `;

  const mailer = initMailer()

  // return a promise
  return mailer.sendMail({
    from: `${name} <${FROM_EMAIL}>`,
    replyTo: email,
    to: TO_EMAIL,
    subject,
    html: wrapped,
  });
}

module.exports = {
  sendEmail: sendEmailWithNodemailer,
  validateInput,
};
