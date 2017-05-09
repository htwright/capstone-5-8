const mongoose = require('mongoose');



const itemSchema = mongoose.Schema({
  author: {type: String},
  subject: {type: String, required: true},
  title: {type: String, required: true},
  content: {type: String, required: true},
  credentials: {type: String}
});

itemSchema.methods.apiRepr = function() {
  return {
    author: this.author,
    subject: this.subject,
    title: this.title,
    content: this.content,
    credentials: this.credentials
  };
};

const Item = mongoose.model('Item', itemSchema);

module.exports = {Item};