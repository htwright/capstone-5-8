var express = require('express');
var app = express();
app.use(express.static('public'));

app.listen(8080 || process.env.PORT, () =>{
    console.log('App listening on 8080');
});

module.exports = {app};
