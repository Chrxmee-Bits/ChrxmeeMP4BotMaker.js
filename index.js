// index.js — ChrxmeeMP4BotMaker-JS Entry Point
const Client = require('./src/Client');
const Commands = require('./src/Commands');
const API = require('./src/API');
const Utils = require('./src/Utils');

module.exports = {
    Client,
    Commands,
    API,
    Utils,
    version: '1.1.2'
};
