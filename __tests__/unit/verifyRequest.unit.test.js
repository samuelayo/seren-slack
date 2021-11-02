process.env.SLACK_SIGNING_SECRET = 'top secret 1';
const { verifyRequest } = require('../../src/utils/verifyRequest');
const { generateSlackSignature } = require('../helpers/helper');

const res = {
  status: (code) => {
    if (code > 299) {
      throw new Error(`Req failed with code: ${code}`);
    }
    return this;
  },
  json: (obj) => {
    console.log(obj);
  },
};

describe('utilities unit tests', () => {
  it('verifies the request', () => {
    const signatureEvent = {
      event: {
        type: 'reaction_added',
        user: 'U012X8BTJFP',
        reaction: 'sled_issue',
        item_user: 'U012X8BTJFP',
        event_ts: '1360782804.083113',
      },
    };
    const timestamp = Math.floor(Date.now() / 1000);
    const req = {
      headers: {
        'x-slack-signature': generateSlackSignature(timestamp, encodeURIComponent(JSON.stringify(signatureEvent))),
        'x-slack-request-timestamp': timestamp,
      },
      rawBody: encodeURIComponent(JSON.stringify(signatureEvent)),
    };

    const next = (_) => {
      expect(_).toBe(undefined);
    };
    verifyRequest(req, res, next);
  });

  it('fails the request for old timestamp', () => {
    const signatureEvent = {
      event: {
        type: 'reaction_added',
        user: 'U012X8BTJFP',
        reaction: 'sled_issue',
        item_user: 'U012X8BTJFP',
        event_ts: '1360782804.083113',
      },
    };
    const timestamp = Math.floor(new Date('1999-01-01').getTime() / 1000);
    const req = {
      headers: {
        'x-slack-signature': generateSlackSignature(timestamp, encodeURIComponent(JSON.stringify(signatureEvent))),
        'x-slack-request-timestamp': timestamp,
      },
      rawBody: encodeURIComponent(JSON.stringify(signatureEvent)),
    };

    const next = (_) => _;
    try {
      verifyRequest(req, res, next);
    } catch (error) {
      expect(error.message).toBe('Req failed with code: 400');
    }
  });

  it('fails to verify the request for bad signing', () => {
    const signatureEvent = {
      event: {
        type: 'reaction_added',
        user: 'U012X8BTJFP',
        reaction: 'sled_issue',
        item_user: 'U012X8BTJFP',
        event_ts: '1360782804.083113',
      },
    };
    const timestamp = Math.floor(Date.now() / 1000);
    const req = {
      headers: {
        'x-slack-signature': generateSlackSignature(timestamp, encodeURIComponent(JSON.stringify(signatureEvent))),
        'x-slack-request-timestamp': timestamp,
      },
      rawBody: JSON.stringify(signatureEvent),
    };

    const next = (_) => _;
    try {
      verifyRequest(req, res, next);
    } catch (error) {
      expect(error.message).toBe('Req failed with code: 400');
    }
  });
});
