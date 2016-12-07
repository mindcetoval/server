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
    dbRemote.query('MATCH u=(User) return u', {}, function (err, result) {
        if (err) throw err;
        console.log(result);
    });
}

module.exports = {
    router: router,
    db: dbRemote,
    getUser: getUser
}