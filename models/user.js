const bcrypt = require('bcrypt');
const { getDB } = require('../lib/dbConnection.js');
const auth = require('../lib/auth.js');
const { isValidEmail } = require('../lib/lib.js');

const SALTROUNDS = 10;

// copied from my previous project - see the original on GitHub here: https://github.com/joepin/project-3
function login(req, res, next) {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  if (!email || !password) next(new Error('Logging in requires both an email and a password.'));

  if (!isValidEmail(email)) next(new Error('Please submit a valid email address.'));

  // build query and value variables
  const query = `SELECT * FROM "user" WHERE email = $1;`;
  const values = [email];

  // execute query, expecting either one row or none - for emails that don't exist
  db.oneOrNone(query, values)
  .then((data) => {
    // if email doesn't exist, reject the user
    if (!data) next(new Error('Invalid login credentials.'));

    // email definitely exists; next step:
    // check if submitted password matches the one in the db
    if (bcrypt.compareSync(password, data.password)) {
      // password matches - good to go!
      // build out an object that we're going to send to the getUserToken method as payload to jwt.sign
      const userObj = {};
      for (let key in data) {
        if (key != 'password') userObj[key] = data[key];
      }
      // call getUserToken on user's data and send it back to the user
      auth.getUserToken(userObj)
      .then((token) => res.token = token)
      .then(() => next())
      .catch(err => next(err));
    } else {
      // if password doesn't match, reject the login attempt
      next(new Error('Invalid login credentials.'));
    }
  })
  /* all that happend inside the then of the db call; now we catch db errors */
  .catch(err => next(err));
}

function loginNew(req, res, next) {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  if (!email || !password) next(new Error('Logging in requires both an email and a password.'));

  if (!isValidEmail(email)) next(new Error('Please submit a valid email address.'));

  getDB().then(db => {
    db.collection('users')
    .findOne({ email: email })
    .then(user => {
      if (!user) next(new Error('Invalid login credentials'));

      bcrypt.compare(password, user.password)
      .then(hash => {
        if (!hash) next(new(Error('Invalid login credentials')));
        res.data = {};
        res.data.fname = user.fname;
        res.data.lname = user.lname;
        res.data.email = user.email;
        auth.getUserToken(res.data)
        .then(token => {
          res.data.token = token;
          next();
        })
        .ctach(tokenErr => next(tokenErr));
      })
      .catch(compareErr => next(compareErr));
    })
    .catch(findErr => next(findErr));
  })
  .catch(dbErr => next(dbErr));
}

// copied from my previous project - see the original on GitHub here: https://github.com/joepin/project-3
function createUser(req, res, next) {
  // get data
  const first = req.body.firstName;
  const last = req.body.lastName;
  const email = req.body.email.toLowerCase();
  const password = bcrypt.hashSync(req.body.password, SALTROUNDS);

  // validate data
  if (!(first || last || email || password)) next(new Error('Please check that all fields were filled out properly.'));
  if (!isValidEmail(email)) next(new Error('Please submit a valid email address.'));

  // build query
  const query = `INSERT INTO "user" (fname, lname, email, password) VALUES ($1, $2, $3, $4) RETURNING user_id, fname, lname, email;`;
  // prepare values array
  const values = [
    first,
    last,
    email,
    password,
  ];

  // execute query with the data...
  db.one(query, values)
  .then((data) => {
    // ...then get a token for the user and send it back to the caller
    auth.getUserToken(data)
      .then((token) => res.token = token)
      .then(() => next())
      .catch(err => next(err));
  })
  /* end of db then; catch db errors now */
  .catch(err => next(err));
}

function createUserNew(req, res, next) {
  // get data
  const first = req.body.firstName;
  const last = req.body.lastName;
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  // validate data
  if (!(first || last || email || password)) next(new Error('Please check that all fields were filled out properly.'));
  if (!isValidEmail(email)) next(new Error('Please submit a valid email address.'));

  getDB().then(db => {
    bcrypt.hash(password, SALTROUNDS)
    .then(hash => {
      if (!hash) next(new Error('Server error'));
      db.collection('users')
      .insertOne({
        fname: first,
        lname: last,
        email: email,
        password: hash,
      })
      .then(result => {
        if (result.ok === 1)
        res.data = result;
        next();
      })
      .catch(insertErr => next(insertErr));
    })
    .catch(hashErr => next(hashErr));
  })
  .catch(dbErr => next(dbErr));
}

module.exports = {
  login: loginNew,
  createUser: createUserNew,
}
