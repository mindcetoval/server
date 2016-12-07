var dbmodule = require('../controllers/neo4j.ctrl');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    dbmodule.getUsers(res);
});

router.get('/:username', function(req, res, next) {
    dbmodule.getUser(res, req.params.username);
});

module.exports = router;