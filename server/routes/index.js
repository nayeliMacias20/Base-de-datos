/*jshint esversion: 8*/
const express = require('express');
const app = express();

app.use('/user', require('./user/users'));
app.use('/', require('./login/login'));
app.use('/desayuno', require('./desayuno/desayuno'));
app.use('/comidas', require('./comida/comida'));
app.use('/colaciones', require('./colaciones/colaciones'));
app.use('/cenas', require('./cenas/cenas'));

module.exports = app;