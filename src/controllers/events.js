const express = require('express');
const { isLoggedIn, isEventOrganizer } = require('../middleware');
const { handle } = require('../utilis');

const Event = require('../models/event');
const Comment = require('../models/comment');
const CommentsController = require('./comments')

var router = express.Router();

router.get('/', async (req, res) => {
    const [events, e] = await handle(Event.find().populate('organizer').sort({ 'createdAt': 'desc' }));

    if (e) {
        console.log(e);
        return;
    }

    res.render('events/list', { page: 'principal', events });
});

router.get('/crear', isLoggedIn, (req, res) => {
    res.render('events/new', { page: 'event_new' });
});

router.post('/crear', isLoggedIn, async (req, res) => {
    const event = new Event(req.body.event);
    event.organizer = req.user._id;
    event.amountOfComments = 0;

    const [new_event, e] = await handle(event.save());

    if (e) {
        console.log(e);
        return;
    }

    console.log('Evento creado');
    res.redirect(`/eventos/${new_event._id}`);
});

router.get('/:id', async (req, res) => {
    let [event, e] = await handle(Event.findOne({ _id: req.params.id }).populate(['organizer']).populate({ path: 'comments', populate: { path: 'author' }, options: { sort: { 'createdAt': 'desc' } } }).exec());
    if (e || event === null) {
        console.log(e);
        return;
    }

    res.render('events/detail', { event, user: req.user });
});

router.delete('/:id', isLoggedIn, isEventOrganizer, async (req, res) => {
    const [event_deleted, e] = await handle(Event.findByIdAndDelete(req.params.id));

    if (e || event_deleted === null) {
        console.log(e);
        return;
    }

    await Comment.deleteMany({ _id: { $in: event_deleted.comments } });
    res.redirect('/eventos');
});

router.use('/:id/comentarios/', CommentsController);

module.exports = router;