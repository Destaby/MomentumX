const Router = require('koa-router');
const router = new Router();

const { getRandomUrl } = require('./controllers');

router.get('/', getRandomUrl);

module.exports = router;
