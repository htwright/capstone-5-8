const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const itemSchema = mongoose.Schema({
  author: {type: String},
  subject: {type: String, required: true},
  title: {type: String, required: true},
  content: {type: String, required: true},
  credentials: {type: String}
});

const Item = mongoose.model('Item', itemSchema);

module.exports = {Item};