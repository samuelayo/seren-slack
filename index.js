const dotenv = require('dotenv');

dotenv.config();
const Start = require('./start');

try {
  const startUp = new Start();
  startUp.startExpress();
} catch (e) {
  console.error('Fatal error while starting up app: ', e && e.message);
}