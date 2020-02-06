#!/usr/bin/env node

const server = require('./server');
const opn = require('open');

let port = process.env.PORT || 8080;

server.start(port);
opn(`http://localhost:${port}/?cart=cart`);