const fetch = require('node-fetch');
const { isValidEmail } = require('../lib/lib.js');

function validateData(req, res, next) {
  const { email } = req.body;
  const fname = req.body.firstName;
  const lname = req.body.lastName;
  const lists = JSON.parse(req.body.emailLists || '[]');

  if (!(email && fname && lname && lists)) {
    const err = new Error('Please fill out all fields.');
    err.status = 422;
    next(err);
  }
  if (!isValidEmail(email)) {
    const err = new Error('Please submit a valid email address.');
    err.status = 422;
    next(err);
  }
  const numberOfLists = lists.reduce((acc, list) => list === true ? acc += 1 : acc, 0);
  if (numberOfLists === 0) {
    const err = new Error('Please select at least one email list.');
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

  const { CC_LIST_TS_TORAH,
    CC_LIST_TS_NACH,
    CC_LIST_MS_DAILY,
    CC_LIST_PSPLUS_DAILY,
    CC_LIST_TS_EVENTS } = process.env;
  const allLists = [
    {
      id: CC_LIST_TS_TORAH,
      name: 'Parashat Hashavua',
    },
    {
      id: CC_LIST_TS_NACH,
      name: 'Nevi\'im & Ketuvim',
    },
    {
      id: CC_LIST_MS_DAILY,
      name: 'MishnaStudy',
    },
    {
      id: CC_LIST_PSPLUS_DAILY,
      name: 'ParashaStudy Plus',
    },
    {
      id: CC_LIST_TS_EVENTS,
      name: 'Events',
    },
  ];

  const bodyLists = JSON.parse(req.body.emailLists || '[]');

  const lists = [];
  for (let i = 0; i < bodyLists.length; i++) {
    if (bodyLists[i]) {
      lists.push({ id: allLists[i].id });
    }
  }

  let url;

  // if the user already exists as a user, we want to re-add them to all the lists they selected
  if (res.existingUser) {
    const user = res.existingUser[0];
    const userID = user.id;
    const apiBase = 'https://api.constantcontact.com/v2';
    url = `${apiBase}/contacts/${userID}?api_key=${key}&action_by=ACTION_BY_VISITOR`;
    method = 'PUT';
    body.lists = lists;
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
      lists,
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
        const retLists = lists.map((listObj) => {
          const obj = allLists.find(o => o.id === listObj.id);
          return { name: obj.name };
        });
        res.data = {
          status: 'OK',
          email: req.body.email,
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          email_lists: retLists,
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
