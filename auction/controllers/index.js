const { redis } = require('../utils');

module.exports = {
  getRedirectionUrl: require('./getRedirectionUrl')({ redis }),
};
