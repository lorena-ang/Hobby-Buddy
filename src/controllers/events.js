const express = require('express');
const { isLoggedIn, isEventAuthor } = require('../middleware');
const { handle } = require('../utilis');

const Event = require('../models/event');

var router = express.Router();

router.get('/', async (req, res) => {
    const [events, e] = await handle(Event.find());

    if (e) {
        console.log(e);
        return;
    }

    res.render('events/list', { page: 'principal', events: events });
});

router.get('/crear', isLoggedIn, (req, res) => {
    res.render('events/new', { page: 'event_new' });
});

router.post('/crear', isLoggedIn, async (req, res) => {
    console.log(req.body.event);
    const event = new Event(req.body.event);
    event.author = req.user._id;

    const [new_event, e] = await handle(event.save());

    if (e) {
        console.log(e);
        return;
    }

    console.log('Evento creado');
    res.redirect(`/eventos/${new_event._id}`);
});

module.exports = router;