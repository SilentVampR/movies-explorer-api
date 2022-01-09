// const { DB_CONNECTION_STRING } = process.env;

const db = {
  name: 'mongodb',
  address: process.env.HOSTNAME,
  port: '27017',
};

const { PORT = 3002 } = process.env;

module.exports = { PORT, db };
