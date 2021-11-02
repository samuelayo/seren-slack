const { Schema, model } = require('mongoose');

const collectionName = 'responses';
const schema = new Schema({
  userId: String,
  name: String,
  question: String,
  answers: [Object],
}, {
  timestamps: true,
});

schema.index({
  createdAt: 1,
}, {
  background: true,
});

module.exports = model(collectionName, schema);
