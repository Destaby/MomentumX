const Router = require('koa-router');
const router = new Router();

const { getRedirectionUrl } = require('./controllers');

router.get('/', getRedirectionUrl);

module.exports = router;
