//mongo ds133321.mlab.com:33321/capstone-5-8 -u dev -p donald
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const {DATABASE_URL, PORT} = require('./config');
const{Item} = require('./models');
mongoose.Promise = global.Promise;

// app.use(express.static('public'));
app.use(bodyParser.json());


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
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
    });
});


app.post('/items', (req, res) =>{
    const requiredFields = ['title', 'content', 'subject'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            throw new Error(message);
        // return res.status(400).send(message);
        }
    }

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
    .catch(err => console.error(err));
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
