const cors = require('cors');

const corsConfig = cors({
  origin: [
    'https://silentvampr.nomoredomains.rocks',
    'http://silentvampr.nomoredomains.rocks',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: 'GET, PATCH, POST, DELETE',
});

module.exports = { corsConfig };
