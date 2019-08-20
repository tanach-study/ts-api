const { MongoClient } = require('mongodb');

let connection = null;
let connectionTime = null;
const CONN_RESET = 3600000; // 1 hour reset

function makeConnection() {
  connection = MongoClient.connect(process.env.DB_CONNECTION, { useNewUrlParser: true });
  connectionTime = Date.now();
}

function getDB() {
  if (!connection) {
    makeConnection();
    return connection;
  }

  const currTime = Date.now();
  if (currTime - connectionTime > CONN_RESET) {
    connection.close();
    makeConnection();
  }

  return connection;
}

function closeDB() {
  if (connection) {
    connection.close();
  }
}

module.exports = {
  getDB,
  closeDB,
};
