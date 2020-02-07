const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

let index = path.join(__dirname, 'index.html')
let cart = "";
let supported = [];


function use(middleware){
    app.use(middleware);
}

use(express.static(__dirname));

app.get('/', function(req, res){
    res.sendFile(index);
});

app.use(function(req, res, next){
    if(!req.path.startsWith('/cart/')){
        next();
        return null;
    }
    let fPath = path.join(cart,req.path.slice('/cart/'.length));
    if(!fs.existsSync(fPath)){
        res.status(404).send('Not found');
        return null;
    }
    if(!supported.includes(path.extname(fPath))){
        res.sendFile(fPath);
    }else{
        next();
    }
});

function start(port, cartPath=process.cwd(), ignore=[]){
    cart = cartPath;
    supported = ignore;
    app.listen(port);
}

module.exports.path = __dirname;
module.exports.start = start;
module.exports.use = use;