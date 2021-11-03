const crypto = require('crypto');

const {
  hmacType, digestType, verificationFailed, oldMessageSent,
} = require('../constants/utils');

const verifyRequest = (req, res, next) => {
  const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
  // message comes in
  const slackSignature = req.headers['x-slack-signature'] || req.headers['X-Slack-Signature'];
  const [version, slackHash] = slackSignature.split('=');
  const timestamp = req.headers['x-slack-request-timestamp'] || req.headers['X-Slack-Request-Timestamp'];
  // convert current time from milliseconds to seconds
  const time = Math.floor(new Date().getTime() / 1000);
 
  if (Math.abs(time - timestamp) > 300) {
    return res.status(400).json({ ok: false, message: oldMessageSent });
  }
  const sigBasestring = `${version}:${timestamp}:${req.rawBody.toString()}`;
  const hmac = crypto.createHmac(hmacType, slackSigningSecret);
  hmac.update(sigBasestring);
  const derivedHash = hmac.digest(digestType);
  if (crypto.timingSafeEqual(Buffer.from(slackHash), Buffer.from(derivedHash))) {
    return next();
  }
  return res.status(400).send(verificationFailed);
};

module.exports = {
  verifyRequest,
};
