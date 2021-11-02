const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const morgan = require('morgan');
const contentType = require('content-type');
const getRawBody = require('raw-body');

const app = express();

app.use(cors());
app.set('trust proxy', true);

if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.use(helmet());
} else {
  app.use(morgan('dev'));
}
app.use((req, res, next) => {
  getRawBody(req, {
    length: req.headers['content-length'],
    limit: '10mb',
    encoding: contentType.parse(req).parameters.charset,
  }, (err, string) => {
    if (err) return next(err);
    req.rawBody = string;
    next();
  });
});
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

module.exports = app;
