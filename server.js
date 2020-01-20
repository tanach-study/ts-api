const dotenv       = require('dotenv');
const express      = require('express');
const logger       = require('morgan');
const bodyParser   = require('body-parser');

const { init: appLoggerInit, getLogger } = require('./lib/logger.js');

dotenv.config({ silent: true });
const app          = express();
const PORT         = process.argv[2] || process.env.PORT || 3000;

appLoggerInit();
const log = getLogger();

app.use(logger('dev'));
app.use(bodyParser.json());

// disable headers related to the server for security purposes
app.disable('x-powered-by');
app.disable('Server');

// allow CORS on the entire site
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token_authorization');
  next();
});

// build API routes
app.use('/signup', require('./routes/signup.js'));
app.use('/api/signup', require('./routes/signup.js'));
app.use('/contact', require('./routes/contact.js'));
app.use('/api/contact', require('./routes/contact.js'));

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).json(err.message);
  } else if (err.message) {
    res.status(500).json(err.message);
  } else {
    res.status(500).json('Internal Server Error');
  }
});

const server = app.listen(PORT, () => log.warn(`Server here! Listening on port ${PORT}!`));

function shutDown(sig) {
  log.info(`received ${sig}, starting shutdown`);
  server.close(() => {
    log.info('closed server, exiting');
    process.exit(0);
  });
}

process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);
