const express = require('express');
const app = express();
const path = require('path');

let index = path.join(__dirname, 'index.html')


function use(middleware){
    app.use(middleware);
}

use(express.static(__dirname));

app.get('/', function(req, res){
    res.sendFile(index);
});

function start(port){
    app.listen(port);
}

start(8080);