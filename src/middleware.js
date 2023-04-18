const Event = require('./models/event');
const Comment = require('./models/comment');
const User = require('./models/user');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log('Debes iniciar sesión para hacer esto');
        return res.redirect('/iniciar_sesion');
    }
    next();
}

module.exports.isEventOrganizer = async (req, res, next) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event.organizer._id.equals(req.user._id)) {
        console.log('No estas autorizado para realizar esta acción');
        return res.redirect('back');
    }
    return next();
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment.author._id.equals(req.user._id)) {
        console.log('No estas autorizado para realizar esta acción');
        return res.redirect('back');
    }
    return next();
}

module.exports.isNew =  async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (user.profile_name != undefined) {
        console.log('Tu información ya había sido guardada previamente.');
        return res.redirect('back');
    }
    return next();
}