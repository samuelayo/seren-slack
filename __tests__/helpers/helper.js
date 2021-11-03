const crypto = require('crypto');

const generateSlackSignature = (timestamp, body) => {
  const slackSecret = process.env.SLACK_SIGNING_SECRET;
  const hmac = crypto.createHmac('sha256', slackSecret);
  hmac.update(`v0:${timestamp}:${body}`);
  return `v0=${hmac.digest('hex')}`;
};

module.exports = {
  generateSlackSignature,
};
