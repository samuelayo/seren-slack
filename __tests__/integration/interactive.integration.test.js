const supertest = require('supertest');
const qs = require('qs');
const dotenv = require('dotenv');
const Start = require('../../start');

dotenv.config();
process.env.SLACK_SIGNING_SECRET = 'top secret 1';
const { generateSlackSignature } = require('../helpers/helper');

const APP_URI = `http://0.0.0.0:${process.env.PORT}`;
const request = supertest(APP_URI);
const END_POINT_INTERACTION = '/interactive';

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

describe('interactive Integration tests', () => {
  beforeAll((done) => before(done));

  afterAll((done) => after(done));

  it('Should return 400 when there is no interaction/when interaction does not have an action_id ', async () => {
    const signatureEvent = {
      payload: JSON.stringify({
        user: {
          id: 'test',
          name: 'test',
        },
      }),
    };
    const event = qs.stringify(signatureEvent, { format: 'RFC1738' });
    const timestamp = Math.floor(Date.now() / 1000);
    const res = await request.post(`${END_POINT_INTERACTION}`)
      .set('x-slack-signature', generateSlackSignature(timestamp, event))
      .set('x-slack-request-timestamp', timestamp)
      .send(event);
    expect(res.body.ok).toBe(false);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('unknown interaction');
  });

  it('Should return 400  when there is an action, but not a valid id ', async () => {
    const signatureEvent = {
      payload: JSON.stringify({
        user: {
          id: 'test',
          name: 'test',
        },
        actions: [
          {
            action_id: 'fake_action',
          },
        ],
      }),
    };
    const event = qs.stringify(signatureEvent, { format: 'RFC1738' });
    const timestamp = Math.floor(Date.now() / 1000);
    const res = await request.post(`${END_POINT_INTERACTION}`)
      .set('x-slack-signature', generateSlackSignature(timestamp, event))
      .set('x-slack-request-timestamp', timestamp)
      .send(event);
    expect(res.body.ok).toBe(false);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('unknown interaction');
  });

  it('Should return 200 ok when the action_id is valid and options are selected', async () => {
    const signatureEvent = {
      payload: JSON.stringify({
        user: {
          id: 'test',
          name: 'test',
        },
        actions: [
          {
            action_id: 'mood_selection',
            selected_option: [
              {
                text: {
                  type: 'plain_text',
                  text: 'Movies',
                  emoji: true,
                },
                value: 'Movies',
              },
            ],
          },
        ],
      }),
    };
    const event = qs.stringify(signatureEvent, { format: 'RFC1738' });
    const timestamp = Math.floor(Date.now() / 1000);
    const res = await request.post(`${END_POINT_INTERACTION}`)
      .set('x-slack-signature', generateSlackSignature(timestamp, event))
      .set('x-slack-request-timestamp', timestamp)
      .send(event);
    expect(res.statusCode).toEqual(200);
  });
  it('Should return 400 when the action_id is valid and options are not selected', async () => {
    const signatureEvent = {
      payload: JSON.stringify({
        user: {
          id: 'test',
          name: 'test',
        },
        actions: [
          {
            action_id: 'mood_selection',
          },
        ],
      }),
    };
    const event = qs.stringify(signatureEvent, { format: 'RFC1738' });
    const timestamp = Math.floor(Date.now() / 1000);
    const res = await request.post(`${END_POINT_INTERACTION}`)
      .set('x-slack-signature', generateSlackSignature(timestamp, event))
      .set('x-slack-request-timestamp', timestamp)
      .send(event);
    expect(res.body.ok).toBe(false);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('No response was selected');
  });

  it('Should return 200 ok when the action_id is valid and options are selected for hobbies', async () => {
    const signatureEvent = {
      payload: JSON.stringify({
        user: {
          id: 'test',
          name: 'test',
        },
        actions: [
          {
            action_id: 'hobby_selection',
            selected_options: [
              {
                text: {
                  type: 'plain_text',
                  text: 'Movies',
                  emoji: true,
                },
                value: 'Movies',
              },
            ],
          },
        ],
      }),
    };
    const event = qs.stringify(signatureEvent, { format: 'RFC1738' });
    const timestamp = Math.floor(Date.now() / 1000);
    const res = await request.post(`${END_POINT_INTERACTION}`)
      .set('x-slack-signature', generateSlackSignature(timestamp, event))
      .set('x-slack-request-timestamp', timestamp)
      .send(event);
    expect(res.statusCode).toEqual(200);
  });

  it('Should return 400 when the action_id is hobby_selection and options are not selected', async () => {
    const signatureEvent = {
      payload: JSON.stringify({
        user: {
          id: 'test',
          name: 'test',
        },
        actions: [
          {
            action_id: 'hobby_selection',
          },
        ],
      }),
    };
    const event = qs.stringify(signatureEvent, { format: 'RFC1738' });
    const timestamp = Math.floor(Date.now() / 1000);
    const res = await request.post(`${END_POINT_INTERACTION}`)
      .set('x-slack-signature', generateSlackSignature(timestamp, event))
      .set('x-slack-request-timestamp', timestamp)
      .send(event);
    expect(res.body.ok).toBe(false);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('No response was selected');
  });
});
