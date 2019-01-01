const { MongoClient } = require('mongodb');

function getDB() {
  return MongoClient.connect(process.env.DB_CONNECTION, { useNewUrlParser: true });
}

module.exports = {
  getDB,
};
