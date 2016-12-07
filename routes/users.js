var dbmodule = require('../controllers/neo4j.ctrl');
var express = require('express');
var router = express.Router();

router.get('/:username', function(req, res, next) {
    dbmodule.getUser(res, req.params.username);
});

router.get('/', function(req, res, next) {
    res.send(dbmodule.getUsers());
});

module.exports = router;