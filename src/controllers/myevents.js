const express = require('express');
const { isLoggedIn } = require('../middleware');
const { handle } = require('../utilis');

const Event = require('../models/event');
const Application = require('../models/application');

var router = express.Router();

router.get('/', isLoggedIn, async (req, res) => {
    const [events, e] = await handle(Event.find({ organizer: { '$eq': req.user._id } }).populate('organizer').sort({ 'createdAt': 'desc' }));
    if (e) {
        console.log(e);
        return;
    }

    res.render('users/myevents', { events });
});

router.get('/:id/aplicaciones', isLoggedIn, async (req, res) => {
    // Getting the applications from the event
    const [applications, e] = await handle(Application.find({ event: req.params.id}).populate('user').sort({ 'user' : -1 }));
    if (e) {
        console.log(e);
        return;
    }
    res.render('users/myeventsapplications', { event_id : req.params.id, applications });
});


router.post('/:id/aplicaciones/:appId', isLoggedIn, async (req, res) => {
    const [application, e] = await handle(Application.findOne({ _id: req.params.appId }));

    if (e || application === null) {
        console.log(e);
        return;
    }

    application.status = true;

    const [_, e_app_saved] = await handle(application.save());


    if (e_app_saved) {
        console.log(e_app_saved);
        return;
    }

    console.log('Aplicacion aceptada');
    res.redirect(`/mis_eventos/${req.params.id}/aplicaciones/`);
});

module.exports = router;