const cors = require('cors');

const corsConfig = cors({
  origin: [
    'https://silentvampr.nomoredomains.work',
    'http://silentvampr.nomoredomains.work',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: 'GET, PUT, PATCH, POST, DELETE',
});

module.exports = { corsConfig };
