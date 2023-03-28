const express = require('express');
const { isLoggedIn } = require('../middleware');
const { handle } = require('../utilis');

const Event = require('../models/event');

var router = express.Router();

router.get('/', isLoggedIn, async (req, res) => {
    const [events, e] = await handle(Event.find({ organizer: { '$eq': req.user._id } }).populate('organizer').sort({ 'createdAt': 'desc' }));
    if (e) {
        console.log(e);
        return;
    }

    res.render('users/myevents', { events });
});

module.exports = router;