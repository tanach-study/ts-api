const fetch = require('node-fetch');
const { isValidEmail } = require('../lib/lib.js');

function validateData(req, res, next) {
  const { email } = req.body;
  const fname = req.body.firstName;
  const lname = req.body.lastName;

  if (!(email && fname && lname)) {
    const err = new Error('Please fill out all fields.');
    err.status = 422;
    next(err);
  }
  if (!isValidEmail(email)) {
    const err = new Error('Please submit a valid email address.');
    err.status = 422;
    next(err);
  }

  // if we're here then all is good
  next();
}

function checkIfEmailExists(req, res, next) {
  const { email } = req.body;
  const key = process.env.CC_KEY;
  const token = process.env.CC_TOKEN;
  const url = `https://api.constantcontact.com/v2/contacts?api_key=${key}&email=${email}`;

  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(r => r.json())
    .then((data) => {
      // if the results set is empty then we're good to continue
      if (data.results && data.results.length === 0) {
        next();
      } else {
        // email address is registered; we need to add them back to the list
        res.existingUser = data.results;
        next();
      }
    })
    .catch(err => next(err));
}

function registerEmail(req, res, next) {
  let body = {};
  let method;
  const key = process.env.CC_KEY;
  const token = process.env.CC_TOKEN;
  const listId = process.env.CC_LIST_PROD;
  let url;

  // if the user already exists as a user, we want to re-add them
  if (res.existingUser) {
    const user = res.existingUser[0];
    const userID = user.id;
    url = `https://api.constantcontact.com/v2/contacts/${userID}?api_key=${key}&action_by=ACTION_BY_VISITOR`;
    method = 'PUT';
    const { lists } = user;
    lists.push({
      id: listId,
    });
    body.lists = lists.map(list => ({
      id: list.id,
    }
    ));
    const emailAddresses = user.email_addresses.map(email => ({
      email_address: email.email_address,
    }
    ));
    body.email_addresses = emailAddresses;
  } else {
    const { email } = req.body;
    const fname = req.body.firstName;
    const lname = req.body.lastName;
    url = `https://api.constantcontact.com/v2/contacts?api_key=${key}&action_by=ACTION_BY_VISITOR`;
    method = 'POST';
    body = {
      lists: [
        {
          id: listId,
        },
      ],
      email_addresses: [
        {
          email_address: email,
        },
      ],
      first_name: fname,
      last_name: lname,
    };
  }

  fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(r => r.json())
    .then((resp) => {
      if (resp.id) {
        res.data = {
          status: 'OK',
          email: req.body.email,
          first_name: req.body.firstName,
          last_name: req.body.lastName,
        };
        next();
      } else {
        const err = new Error('Internal server error.');
        err.status = 500;
        next(err);
      }
    })
    .catch(err => next(err));
}

module.exports = {
  validateData,
  checkIfEmailExists,
  registerEmail,
};
