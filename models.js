const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const itemSchema = mongoose.Schema({
  author: {type: String, required: true},
  subject: {type: String, required: true},
  title: {type: String, required: true},
  content: {type: String, required: true},
  credentials: {type: String, default: 'Not Entered'}
});

itemSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    author: this.author,
    subject: this.subject,
    title: this.title,
    content: this.content,
    credentials: this.credentials
  };
};

const Item = mongoose.model('Item', itemSchema);


const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.methods.apiRepr = function() {
  return {
    username: this.username || '',
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt
    .compare(password, this.password);
    
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt
    .hash(password, 10)
    .then(hash => hash);
};

const User = mongoose.model('User', UserSchema);

module.exports = {Item, User};