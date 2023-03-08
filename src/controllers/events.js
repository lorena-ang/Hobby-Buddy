const express = require('express');

var router = express.Router();

router.get('/', (req, res) => {
    res.render('events/list', { page: 'principal' });
});

module.exports = router;