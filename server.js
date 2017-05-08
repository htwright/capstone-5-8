var express = require('express');
var app = express();
require('dotenv').config();
app.use(express.static('public'));

app.listen(process.env.PORT || 8080, () =>{
    console.log('App listening on 8080');
});

module.exports = {app};
