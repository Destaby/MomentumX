const redis = require('redis');

const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient({ port: REDIS_PORT });

const prefix = 'MomentumX-';

redis.debug = process.env.NODE_ENV === 'development' ? true : false;

client.on('error', err => {
  console.log('Error ' + err);
});

const getValue = (key, next) => {
  if (!client.connected) {
    return next();
  } else
    client.get(prefix + key, (err, result) => {
      console.log(err, result);
      if (err || !result) return next(err);
      return next(null, JSON.parse(result));
    });
};

const setValue = (key, data, next) =>
  new Promise(async resolve => {
    if (!client.connected) {
      if (next) await next();
      resolve();
    } else
      return client.set(prefix + key, JSON.stringify(data), async () => {
        if (next) {
          await next();
          resolve();
        } else resolve(null);
      });
  });

module.exports = {
  getValue,
  setValue,
};
