const supertest = require('supertest');
const dotenv = require('dotenv');
const Start = require('../../start');
const ResponseModel = require('../../src/models/Responses');

dotenv.config();
const APP_URI = `http://0.0.0.0:${process.env.PORT}`;
const request = supertest(APP_URI);
const END_POINT_HEALTHCHECK = '/healthCheck';
const END_POINT_ANSWERS = '/answers';

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

describe('Answers Integration tests', () => {
  beforeAll((done) => before(done));

  afterAll((done) => after(done));

  it('returns 200 on health check', async () => {
    const { body } = await request.get(END_POINT_HEALTHCHECK).send({});
    expect(body.message).toEqual('Server up! Go to /guide to see usage guide.');
  });

  it('Should return 0 records on wrong userId', async () => {
    const {
      body,
    } = await request.post(`${END_POINT_ANSWERS}/user/notexistsidhere`).send({
    });
    expect(body.totalCount).toEqual(0);
    expect(body.ok).toEqual(true);
    expect(Array.isArray(body.results)).toBe(true);
  });

  it('Should return 30 as the limit', async () => {
    const {
      body,
    } = await request.post(`${END_POINT_ANSWERS}/user/notexistsidhere`).send({
      limit: 30,
    });
    expect(body.totalCount).toEqual(0);
    expect(body.ok).toEqual(true);
    expect(Array.isArray(body.results)).toBe(true);
    expect(body.paginationLimit).toBe(30);
  });

  it('Should return 50 as default limit', async () => {
    const {
      body,
    } = await request.post(`${END_POINT_ANSWERS}/all`).send({
    });
    expect(body.ok).toEqual(true);
    expect(Array.isArray(body.results)).toBe(true);
    expect(body.paginationLimit).toBe(50);
  });

  it('Should pull at least 5 records for user ahjnmls', async () => {
    const user = {
      name: 'hello there',
      id: 'ahjnmls',
    };
    const helloQuestion = 'Question from test';
    const selectedResponse = [{ text: 's', value: 's' }];
    const saveResponse = new ResponseModel({
      name: user.name, userId: user.id, question: helloQuestion, answers: selectedResponse,
    });
    const saveResponse1 = new ResponseModel({
      name: user.name, userId: user.id, question: helloQuestion, answers: selectedResponse,
    });
    const saveResponse2 = new ResponseModel({
      name: user.name, userId: user.id, question: helloQuestion, answers: selectedResponse,
    });
    const saveResponse3 = new ResponseModel({
      name: user.name, userId: user.id, question: helloQuestion, answers: selectedResponse,
    });
    const saveResponse4 = new ResponseModel({
      name: user.name, userId: user.id, question: helloQuestion, answers: selectedResponse,
    });
    await saveResponse.save();
    await saveResponse1.save();
    await saveResponse2.save();
    await saveResponse3.save();
    await saveResponse4.save();
    const {
      body,
    } = await request.post(`${END_POINT_ANSWERS}/user/ahjnmls`).send({
    });
    expect(body.ok).toEqual(true);
    expect(body.totalCount).toBeGreaterThanOrEqual(5);
    expect(Array.isArray(body.results)).toBe(true);
    expect(body.paginationLimit).toBe(50);
  });


  it('Should pull only 1 records for user alllmi', async () => {
    const user = {
      name: 'hello there',
      id: 'alllmi',
    };
    const helloQuestion = 'Question from test';
    const selectedResponse = [{ text: 's', value: 's' }];
    const saveResponse = new ResponseModel({
      name: user.name, userId: user.id, question: helloQuestion, answers: selectedResponse,
    });
    const saveResponse1 = new ResponseModel({
      name: user.name, userId: user.id, question: helloQuestion, answers: selectedResponse,
    });
    const saveResponse2 = new ResponseModel({
      name: user.name, userId: user.id, question: helloQuestion, answers: selectedResponse,
    });
    const saveResponse3 = new ResponseModel({
      name: user.name, userId: user.id, question: helloQuestion, answers: selectedResponse,
    });
    const saveResponse4 = new ResponseModel({
      name: user.name, userId: user.id, question: helloQuestion, answers: selectedResponse,
    });
    await saveResponse.save();
    await saveResponse1.save();
    await saveResponse2.save();
    await saveResponse3.save();
    await saveResponse4.save();
    const {
      body,
    } = await request.post(`${END_POINT_ANSWERS}/user/alllmi`).send({
      limit: 1,
    });
    expect(body.ok).toEqual(true);
    expect(body.results.length).toBe(1);
    expect(Array.isArray(body.results)).toBe(true);
    expect(body.paginationLimit).toBe(1);
  });

  it('all route should be more than 10 users', async () => {
    const {
      body,
    } = await request.post(`${END_POINT_ANSWERS}/all`).send({
    });
    expect(body.totalCount).toBeGreaterThanOrEqual(10);
    expect(body.ok).toEqual(true);
    expect(Array.isArray(body.results)).toBe(true);
    expect(body.paginationLimit).toBe(50);
  });
});
