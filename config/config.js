// const { DB_CONNECTION_STRING } = process.env;

const { NODE_ENV } = process.env;

const serverAddress = NODE_ENV === 'production' ? 'localhost' : 'localhost';

const db = {
  name: 'mongodb',
  address: serverAddress,
  port: '27017',
};

const { PORT = 3002 } = process.env;

module.exports = { PORT, db };
