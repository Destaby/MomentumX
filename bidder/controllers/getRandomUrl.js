const crypto = require('crypto');

/**
 * if these constants were needed someone else,
 * it would be better to write them
 * inside helper.js file or utils folder
 */

const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGIT = '0123456789';
const ALPHA_DIGIT = ALPHA_LOWER + DIGIT;
const BYTE = 256;

const getBid = () => (Math.random() + 1) * 5;
const getEncodedUrl = () => {
  const base = ALPHA_DIGIT.length;
  const bytes = crypto.randomBytes(base);
  let url = '';
  for (let i = 0; i < base; i++) {
    const index = ((bytes[i] * base) / BYTE) | 0;
    url += ALPHA_DIGIT[index];
  }
  return `http://${encodeURI(url)}/`;
};

module.exports = async ctx => {
  const { ip, ua } = ctx.request.query;
  if (!ip || !ua) return (ctx.status = 400);
  const bid = getBid();
  const url = getEncodedUrl();
  ctx.body = { bid, url };
};
