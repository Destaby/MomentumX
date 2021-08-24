const getRequestsArray = (n, url) => {
  const requests = [];
  for (let i = 0; i < n; i++) {
    requests.push(fetch(url));
  }
  return requests;
};
const REQUESTS_TO_BIDDER = 3;

module.exports =
  ({ redis }) =>
  async ctx => {
    const { ip, ua, partner_id } = ctx.request.query;
    // do we need partner_id?
    if (!ip || !ua) return (ctx.status = 400);
    const { getValue, setValue } = redis;
    const counter = await new Promise(resolve => {
      getValue(ip, (err, data) => {
        if (err || !data) resolve(null);
        else resolve(data);
      });
    });
    if (counter && counter > 2) return (ctx.body = '');
    const bidderUrl = `http://${ctx.request.header.host}/bidder?ip=${ip}&ua=${ua}`;
    const [_, ...bidders] = await Promise.allSettled([
      setValue(ip, counter ? counter + 1 : 1),
      ...getRequestsArray(REQUESTS_TO_BIDDER, bidderUrl),
    ]);
    const biddersResponses = bidders.filter(
      ({ status }) => status === 'fulfilled'
    );
    const biddersData = await Promise.allSettled(
      biddersResponses.map(({ value: res }) => res.json())
    );
    const url = biddersData
      .map(({ value }) => value)
      .reduce((prev, curr) => (curr.bid > prev.bid ? curr : prev), {
        bid: 0,
      })?.url;
    url ? ctx.redirect(url) : (ctx.status = 500);
  };
