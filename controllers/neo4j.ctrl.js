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

var getUser = function (res, username) {
    dbRemote.query("match (user: User {nickname: {nickname}})-[:HAS]-(trophies) " +
                   "with trophies, sum(trophies.points) as total match (user: User {nickname: {nickname}})-[:STUDIES]-(lessons) " +
                   "return user, collect(distinct lessons) as lessons, collect(distinct trophies) as trophies, sum(distinct total) as total",
                   { nickname: username }, function (err, results) {
        if (err) {
            // A Neo4j exception occurred
            throw err;
        }

        // do something with the matched node(s).
        res.send(results[0]);
    });
}

var getUsers = function () {
    var allUsers = ['gazu','ofer','sitonZ','kfirstar'];
    var allUsersData = [];

    for (var i = 0; i<4; i++) {
        allUsersData.push(getUser(allUsers[i]));
    }

    return allUsersData;
}

var getWorld = function (res) {
    dbRemote.query("match (kp:KnowledgePoint) with distinct kp match (kp)-[:LEADS_TO]->(m) return kp as nodes, collect(m) as leadsTo",
        function (err, results) {
        if (err) {
            // A Neo4j exception occurred
            throw err;
        }

        // do something with the matched node(s).
        res.send(results);
    });
}

module.exports = {
    router: router,
    db: dbRemote,
    getUser: getUser,
    getUsers: getUsers,
    getWorld: getWorld
}