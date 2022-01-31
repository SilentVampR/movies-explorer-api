const { NODE_ENV } = process.env;

const serverAddress = NODE_ENV === 'production' ? 'localhost' : 'localhost';

const { SERVER_ADDRESS = serverAddress } = process.env;

const jwtDevSecret = 'some-dev-secret';

const db = {
  name: 'moviesdb',
  address: SERVER_ADDRESS,
  port: '27017',
};

const { PORT = 3002 } = process.env;

module.exports = { PORT, db, jwtDevSecret };
