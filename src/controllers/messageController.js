const crypto = require('crypto');
const qs = require('qs');

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;

const verifyMessage = (req, res, next) => {
  // message comes in
  const slackRequest = qs.stringify(req.body, { format: 'RFC1738' });
  const slackSignature = req.headers['x-slack-signature'];
  const timestamp = req.headers['X-Slack-Request-Timestamp'];
  // convert current time from milliseconds to seconds
  const time = Math.floor(new Date().getTime() / 1000);

  if (Math.abs(time - timestamp) > 300) {
    return res.status(400).json({ ok: false, message: 'Message appears to have been sent more than 5 mins ago' });
  }

  const sigBasestring = `v0:${timestamp}:${slackRequest}`;

  const mySignature = `v0=${
    crypto.createHmac('sha256', slackSigningSecret)
      .update(sigBasestring, 'utf8')
      .digest('hex')}`;
  if (crypto.timingSafeEqual(
    Buffer.from(mySignature, 'utf8'),
    Buffer.from(slackSignature, 'utf8'),
  )
  ) {
    //
    next();
  }
  return res.status(400).send('Verification failed');
};

const processMessage = (req, res) => {
  const slackRequest = req.body;
  const { challenge } = slackRequest;
  if (challenge) return res.json(challenge).end();
  console.log(slackRequest);
  return res.status(200).json({ ok: 'True' });
};

module.exports = {
  processMessage,
  verifyMessage,
};
