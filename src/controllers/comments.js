var express = require('express');

const { isLoggedIn, isCommentAuthor } = require('../middleware');
const { handle } = require('../utilis');

const Comment = require('../models/comment');
const Event = require('../models/event');

var router = express.Router({ mergeParams: true });

router.post('/', isLoggedIn, async (req, res) => {
    var comment = new Comment(req.body);
    comment.author = req.user._id;

    const [comment_saved, e_comment] = await handle(comment.save());

    if (e_comment) {
        console.log(e_comment);
        return;
    }

    const [event, e_event] = await handle(Event.findOne({ _id: req.params.id }).exec());

    if (e_event || event === null) {
        console.log(e_event);
        return;
    }

    event.comments.push(comment_saved._id);
    event.amountOfComments = event.amountOfComments + 1;

    const [_, e_event_saved] = await handle(event.save());

    if (e_event_saved) {
        console.log(e_event_saved);
        return;
    }

    console.log("Comentario agregado");
    res.redirect(`/eventos/${req.params.id}`)
});

router.delete('/:commentId', isLoggedIn, isCommentAuthor, async (req, res) => {
    await Comment.findByIdAndDelete(req.params.commentId);
    console.log("Comentario borrado");
    
    const [event, e_event] = await handle(Event.findOne({ _id: req.params.id }).exec());

    if (e_event || event === null) {
        console.log(e_event);
        return;
    }

    event.amountOfComments = event.amountOfComments - 1;

    const [_, e_event_saved] = await handle(event.save());

    if (e_event_saved) {
        console.log(e_event_saved);
        return;
    }

    res.redirect(`/eventos/${req.params.id}/`);
});

module.exports = router;