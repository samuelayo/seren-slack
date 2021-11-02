const crypto = require('crypto');

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;

const verifyMessage = (req, res, next) => {

  console.log(req.headers)
  console.log(req.body)
  // message comes in
  const slackSignature = req.headers['x-slack-signature'] || req.headers['X-Slack-Signature'];
  const [version, slackHash] = slackSignature.split('=');
  const timestamp = req.headers['x-slack-request-timestamp'] || req.headers['X-Slack-Request-Timestamp'];
  // convert current time from milliseconds to seconds
  const time = Math.floor(new Date().getTime() / 1000);

  if (Math.abs(time - timestamp) > 300) {
    console.log('late message', time, timestamp);
    return res.status(400).json({ ok: false, message: 'Message appears to have been sent more than 5 mins ago' });
  }
  console.log(version, "ver", req.rawBody.toString())
  const sigBasestring = `${version}:${timestamp}:${req.rawBody.toString()}`;
  const hmac = crypto.createHmac('sha256', slackSigningSecret);
  hmac.update(sigBasestring);
  const derivedHash = hmac.digest('hex');
  if (crypto.timingSafeEqual(Buffer.from(slackHash), Buffer.from(derivedHash))) {
    return next();
  }

  console.log('verification failed');
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
