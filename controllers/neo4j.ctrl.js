var neo4j = require('neo4j');
var express = require('express');
var router = express.Router();
var request = require('request');

var dbRemote = require("seraph")({
    server: "http://hobby-ifkgmmbeoeaggbkeobegokol.dbs.graphenedb.com:24789",
    endpoint: "/db/data",
    user: 'mindcetoval',
    pass: 'VcTQbMhq4N9GmkmXhlgj'
});

var getUser = function (req, res) {
    dbRemote.find({ nickname: 'ofer' }, 'User', function (err, results) {
        if (err) {
            // A Neo4j exception occurred
            return;
        }
        // do something with the matched node(s).
        console.log(results);
    });
}

module.exports = {
    router: router,
    db: dbRemote,
    getUser: getUser
}