const express = require('express');
const { isLoggedIn, isEventOrganizer } = require('../middleware');
const { handle } = require('../utilis');

const Event = require('../models/event');
const Comment = require('../models/comment');
const CommentsController = require('./comments');
const Application = require('../models/application');

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
    event.amountOfApplications = 0;

    const [new_event, e] = await handle(event.save());

    if (e) {
        console.log(e);
        return;
    }

    req.flash('success', 'Publicación creada exitosamente.')
    console.log('Evento creado');
    res.redirect(`/eventos/${new_event._id}`);
});

router.get('/:id', async (req, res) => {
    const [event, e] = await handle(Event.findOne({ _id: req.params.id }).populate(['organizer']).populate({ path: 'comments', populate: { path: 'author' }, options: { sort: { 'createdAt': 'desc' } } }).exec());
    if (e || event === null) {
        console.log(e);
        return;
    }

    var applied = false;
    if (event.applications && req.user && event.applications.includes(req.user._id)) {
        applied = true;
    }

    res.render('events/detail', { event, user: req.user, applied });
});

router.delete('/:id', isLoggedIn, isEventOrganizer, async (req, res) => {
    const [event_deleted, e] = await handle(Event.findByIdAndDelete(req.params.id));

    if (e || event_deleted === null) {
        console.log(e);
        return;
    }

    await Comment.deleteMany({ _id: { $in: event_deleted.comments } });
    req.flash('success', 'Publicación eliminada exitosamente.')

    res.redirect('/eventos');
});

router.post('/:id/aplicar', isLoggedIn, async (req, res) => {
    const [event, e_event] = await handle(Event.findOne({ _id: req.params.id }).exec());

    if (e_event || event === null) {
        console.log(e_event);
        return;
    }
    event.applications.push(req.user._id);
    event.amountOfApplications = event.amountOfApplications + 1;

    const [_, e_event_saved] = await handle(event.save());

    if (e_event_saved) {
        console.log(e_event_saved);
        return;
    }

    const application = new Application({user: req.user._id, event: req.params.id});

    const [new_application, e_app] = await handle(application.save());

    if (e_app) {
        console.log(e);
        return;
    }

    console.log("Aplicado a evento");
    res.redirect(`/eventos/${req.params.id}`);
});

router.delete('/:id/desaplicar', isLoggedIn, async (req, res) => {
    const [event, e_event] = await handle(Event.updateOne({  _id: req.params.id  }, { '$pull': { applications: req.user._id } }).exec());

    if (e_event || event === null) {
        console.log(e_event);
        return;
    }

    const [event_app, e_event_app] = await handle(Event.findOne({ _id: req.params.id }).exec());

    if (e_event_app || event_app === null) {
        console.log(e_event_app);
        return;
    }
    event_app.amountOfApplications = event_app.amountOfApplications - 1;

    const [_, e_event_saved] = await handle(event_app.save());

    if (e_event_saved) {
        console.log(e_event_saved);
        return;
    }

    const [application_deleted, e_app_deleted] = await handle(Application.deleteOne({ user: req.user._id, event: req.params.id }));

    if (e_app_deleted || application_deleted === null) {
        console.log(e);
        return;
    }

    res.redirect('back');
});

router.use('/:id/comentarios/', CommentsController);

module.exports = router;