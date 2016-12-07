var dbmodule = require('../controllers/neo4j.ctrl');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    dbmodule.getWorld(res);
});

module.exports = router;