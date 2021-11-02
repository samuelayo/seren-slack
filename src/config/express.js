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

const rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(express.json());

app.use(express.urlencoded({ extended: true, verify: rawBodySaver }));

module.exports = app;
