const Event = require('./models/event')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log('Debes de iniciar sesión para hacer esto');
        return res.redirect('/iniciar_sesion');
    }
    next();
}

module.exports.isEventAuthor = async (req, res, next) => {
    const { event_id } = req.params;
    const event = await Event.findById(event_id);
    if (!event.author._id.equals(req.user._id)) {
        console.log('No estas autorizado para realizar esta acción');
        return res.redirect('back');
    }
    return next();
}