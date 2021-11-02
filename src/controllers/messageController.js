const crypto = require('crypto');

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;

const verifyMessage = (req, res, next) => {
  console.log(req.headers);
  console.log(req.body);
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
  console.log(version, 'ver', req.rawBody.toString());
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

const generateHelloDropDown = (text) => ({
  text,
  response_type: 'in_channel',
  attachments: [
    {
      text: 'Choose a game to play',
      fallback: "If you could read this message, you'd be choosing something fun to do right now.",
      color: '#3AA3E3',
      attachment_type: 'default',
      callback_id: 'mood_selection',
      actions: [
        {
          name: 'mood_list',
          text: 'Pick a response...',
          type: 'select',
          options: [
            {
              text: 'Hearts',
              value: 'hearts',
            },
            {
              text: 'Bridge',
              value: 'bridge',
            },

          ],
        },
      ],
    },
  ],
});

const processMessage = (req, res) => {
  const slackRequest = req.body;
  const { challenge } = slackRequest;
  if (challenge) return res.json(challenge).end();
  if (slackRequest.text === 'hello') {
    const text = `@${slackRequest.user_id} how are you doing?`;
    const dropdown = generateHelloDropDown(text);
    return res.status(200).json(dropdown);
  }

  return res.status(200).json({ ok: true });
};

module.exports = {
  processMessage,
  verifyMessage,
};
