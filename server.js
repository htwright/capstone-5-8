//mongo ds133321.mlab.com:33321/capstone-5-8 -u dev -p donald
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const {DATABASE_URL, PORT} = require('./config');
const{Item, User} = require('./models');
const cors = require('cors');
// const passport = require('passport');
// const {BasicStrategy} = require('passport-http');
mongoose.Promise = global.Promise;
//try to remove ^^^

app.use(express.static('js'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// const strategy = new BasicStrategy(function(username, password, callback) {
//   let user;
//   User
//     .findOne({username: username})
//     .exec()
//     .then(_user => {
//       user = _user;
//       if (!user) {
//         return callback(null, false, {message: 'Incorrect username'});
//       }
//       return user.validatePassword(password);
//     })
//     .then(isValid => {
//       if (!isValid) {
//         return callback(null, false, {message: 'Incorrect password'});
//       }
//       else {
//         return callback(null, user);
//       }
//     });
// });

// passport.use(strategy);

// app.post('/users', (req, res) => {
//   const requiredFields = ['username', 'password'];

//   const missingIndex = requiredFields.findIndex(field => !req.body[field]);
//   if (missingIndex != -1) {
//     return res.status(400).json({
//       message: `Missing field: ${requiredFields[missingIndex]}`
//     });
//   }

  // let {username, password} = req.body;

  // username = username.toLowerCase().trim();
  // password = password.trim();

  // check for existing user
//   return User
//     .find({username})
//     .count()
//     .exec()
//     .then(count => {
//       if (count > 0) {
//         return res.status(422).json({message: 'username already taken'});
//       }
//       // if no existing user, hash password
//       return User.hashPassword(password);
//     })
//     .then(hash => {
//       return User
//         .create({
//           username,
//           password: hash,
//         });
//     })
//     .then(user => {
//       return res.status(201).json(user.apiRepr());
//     })
//     .catch(err => {
//       res.status(500).json({message: 'Internal server error'});
//     });
// });


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/items', (req, res) => {
  Item
    .find()
    .then(items =>{
      return res.json(items.map(item => item.apiRepr()));
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: 'Something went wrong!!!'});
    });
});

app.get('/items/:id', (req, res) => {
  Item
    .findById(req.params.id)
    .then(result => res.json(result.apiRepr()))
    .catch(err => res.status(500).send('Something went wrong!!!'));
});

app.post('/items', (req, res) =>{
  let requiredFields = ['subject', 'title', 'content', 'author'];
  let isValid = true;
  let missingField = [];
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      isValid = false;
      missingField.push(field);
    }});
  
  if (!(isValid)){
    res.status(400).json({error: `Missing ${missingField} field in request body`});
    return;
  }
  
  Item
    .create({
      author: req.body.author,
      subject: req.body.subject,
      title: req.body.title,
      content: req.body.content,
      credentials: req.body.credentials
    })
    .then(result => {
      res.status(201).json(result.apiRepr());
      //add location
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: 'Something went wrong!!!'});
    });
});

app.put('/items/:id', (req,res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
    return;
  }

  const updatedItem = {};
  const updateableFields = ['subject', 'title','content', 'credentials'];
  updateableFields.forEach(field => {
    if(field in req.body) {
      updatedItem[field] = req.body[field];
    }
  });
  Item
  .findByIdAndUpdate(req.params.id, {$set: updatedItem}, {new: true})
  .then(() => {
    res.status(201).send();
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: 'Something went wrong!!!'});
  });
});

app.delete('/items/:id', (req,res) => {
  Item
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({message: 'Item successfully deleted!!!'});
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: 'Something went wrong!!!'});
    });
});

app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {runServer, app, closeServer};