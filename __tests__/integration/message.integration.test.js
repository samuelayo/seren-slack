const supertest = require('supertest');
const qs = require('qs');
const dotenv = require('dotenv');
const Start = require('../../start');

dotenv.config();
process.env.SLACK_SIGNING_SECRET = 'top secret 1';
const { generateSlackSignature } = require('../helpers/helper');

const APP_URI = `http://0.0.0.0:${process.env.PORT}`;
const request = supertest(APP_URI);
const END_POINT_MESSAGE = '/messages';

// load up the app:
const startUp = new Start();

const before = (done) => {
  startUp.startExpress()
    .then((_) => done());
};

const after = (done) => {
  startUp.closeServer()
    .then((_) => done());
};

describe('message Integration tests', () => {
  beforeAll((done) => before(done));

  afterAll((done) => after(done));

  it('Should return 200 ok when the text is hello ', async () => {
    const signatureEvent = {
      text: 'hello',
    };
    const event = qs.stringify(signatureEvent, { format: 'RFC1738' });
    const timestamp = Math.floor(Date.now() / 1000);
    const res = await request.post(`${END_POINT_MESSAGE}`)
      .set('x-slack-signature', generateSlackSignature(timestamp, event))
      .set('x-slack-request-timestamp', timestamp)
      .send(event);
    // console.log(res);
    expect(res.body).toEqual('');
    expect(res.statusCode).toEqual(200);
  });

  it('Should return 200 ok and text and a field of ok true when text is not hellp ', async () => {
    const signatureEvent = {
      text: 'help',
    };
    const event = qs.stringify(signatureEvent, { format: 'RFC1738' });
    const timestamp = Math.floor(Date.now() / 1000);
    const res = await request.post(`${END_POINT_MESSAGE}`)
      .set('x-slack-signature', generateSlackSignature(timestamp, event))
      .set('x-slack-request-timestamp', timestamp)
      .send(event);
    // console.log(res);
    expect(res.body.ok).toEqual(true);
    expect(res.statusCode).toEqual(200);
  });
});
