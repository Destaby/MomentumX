require('isomorphic-fetch');
const Koa = require('koa');
const mount = require('koa-mount');

const app = new Koa();

const bidder = require('./bidder');
const auction = require('./auction');

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '127.0.0.1';

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = 'Oops... Something went wrong.';
  }
});

app.use(mount('/bidder', bidder));
app.use(mount('/auction', auction));

app.listen(PORT, HOST, () =>
  console.log(`Server is listening on http://${HOST}:${PORT}`)
);

module.exports = app;
