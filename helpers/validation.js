const validator = require('validator');

const validateUrl = (value) => {
  if (!validator.isURL(value, { protocols: ['http', 'https'], require_tld: true, require_protocol: true })) {
    throw new Error('Поле не является действительным URL адресом');
  }
  return value;
};

module.exports = validateUrl;
