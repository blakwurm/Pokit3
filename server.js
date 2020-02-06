const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

let index = path.join(__dirname, 'index.html')
let cart = "";


function use(middleware){
    app.use(middleware);
}

use(express.static(__dirname));

app.get('/', function(req, res){
    res.sendFile(index);
});

app.get('/cart/*', function(req, res){
    let fPath = path.join(cart,req.path.slice('/cart/'.length));
    if(!fs.existsSync(fPath)){
        res.status(404).send('Not found');
        return null;
    }
    res.sendFile(fPath);
});

function start(port, cartPath=process.cwd()){
    cart = cartPath;
    app.listen(port);
}

module.exports.start = start;
module.exports.use = use;