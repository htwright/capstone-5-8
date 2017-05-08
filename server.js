//mongo ds133321.mlab.com:33321/capstone-5-8 -u dev -p donald
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const {DATABASE_URL, PORT} = require('./config');
const{Item} = require('./models');
mongoose.Promise = global.Promise;
//try to remove ^^^

// app.use(express.static('public'));
app.use(bodyParser.json());


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/items', (req, res) =>{
  Item
    .find()
    .then(items =>{
      let mapped = [];
      for(let i = 0; i < items.length; i++){
        mapped[i] = items[i].apiRepr();
      }
      let mapped1 = JSON.stringify(mapped, null, 2);
      return res.send(mapped1);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: 'Something went wrong!!!'});
    });
});

function requiredFields(res, reqBody, fields) {
  fields.forEach(field => {
    if (!(field in reqBody)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      throw new Error(res.status(400).send(message));
    }});
}

app.post('/items', (req, res) =>{
  requiredFields(res, req.body, ['subject', 'title', 'content']);
  
  Item
    .create({
      author: req.body.author,
      subject: req.body.subject,
      title: req.body.title,
      content: req.body.content,
      credentials: req.body.credentials
    })
    .then(() => {
      res.status(201).send('Item sucessfully created!');
    })
    //provide update links
    //provide feedback on input
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
  }

  const updatedItem = {};
  const updateableFields = ['subject', 'title','content'];
  updateableFields.forEach(field => {
    if(field in req.body) {
      updatedItem[field] = req.body[field];
    }
  });
  Item
  .findByIdAndUpdate(req.params.id, {$set: updatedItem}, {new: true})
  .then(result => {
    res.status(201).json(result.apiRepr());
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