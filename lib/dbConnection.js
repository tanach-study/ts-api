const { MongoClient } = require('mongodb');

let connection = null;
let connectionTime = null;
const CONN_RESET = 3600000; // 1 hour reset

function makeConnection() {
  connection = MongoClient.connect(process.env.DB_CONNECTION);
  connectionTime = Date.now();
}

function getDB() {
  if (!connection) {
    makeConnection();
  }

  const currTime = Date.now();
  if (currTime - connectionTime > CONN_RESET) {
    makeConnection();
  }

  return connection;
}

module.exports = {
  getDB,
};
