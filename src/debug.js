'use strict';

module.exports.setup = function (app) {
    var path = require('path');
    var express = require('express')
    var storageManager = require('./app/storageManager')

    // Setup home page
    app.get('/debug/resetdb', async function (req, res) {
        let result = storageManager.reset().catch((err) => { console.error(err) })
        if (!result) {
            res.send('Could not reset db');
        } else {
            res.send('Db reset successfully');
        }
    });

    // Setup the static tab
    app.get('/hello', function (req, res) {
        res.render('hello');
    });

    // Setup the configure tab, with first and second as content tabs
    app.get('/configure', function (req, res) {
        res.render('configure');
    });

    app.get('/first', function (req, res) {
        res.render('first');
    });

    app.get('/second', function (req, res) {
        res.render('second');
    });
};
