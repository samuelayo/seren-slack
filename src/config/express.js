const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors());
app.set('trust proxy', true);

if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.use(helmet());
} else {
  app.use(morgan('dev'));
}

const rawBodySaver = function (req, _res, buf) {
  if (buf && buf.length) {
    req.rawBody = buf;
  }
};
app.use(express.urlencoded({ verify: rawBodySaver, extended: true }));

module.exports = app;
