const CustomError = require('../../src/utils/customError');

describe('customError unit tests', () => {
  it('throws the right error', () => {
    const message = 'this is a message';
    const code = '408';
    try {
      new CustomError(message, code);
    } catch (error) {
      expect(error.code).toBe(code);
      expect(error.message).toBe(message);
    }
  });


  it('throws 500 when code is larger than 4003', () => {
    const message = 'this is a message';
    const code = '8888';
    try {
      new CustomError(message, code);
    } catch (error) {
      expect(error.code).toBe(500);
      expect(error.message).toBe(message);
    }
  });
});

