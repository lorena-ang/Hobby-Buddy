const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const { isLoggedIn, isNew } = require('../middleware');
const { handle } = require('../utilis');

const { resolveInclude } = require('ejs');

var router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/eventos');
});

router.get('/registro', (req, res) => {
    if (req.isAuthenticated()) {
        console.log('Para registrar una nueva cuenta, termine su sesión primero');
        return res.redirect('/eventos');
    }
    res.render('./auth/register', { page: 'register' });
});

router.post('/registro', async (req, res) => {
    try {
        const { user } = req.body;
        if (user.password != user.confirm_password) {
            console.log('Las contraseñas no son iguales');
            res.redirect('/registro');
        } else {
            const user_info = new User({ email: user.email, name: user.name });
            const new_user = await User.register(user_info, user.password);

            req.login(new_user, e => {
                if (e) {
                    console.log(e);
                }
                return res.redirect('/mi_info');
            });
        }
    } catch (e) {
        // TODO: Print each type of error (existing email or username in db)
        console.log('Error: ' + e.message);
        res.redirect('/registro');
    }
});

router.get('/iniciar_sesion', (req, res) => {
    if (req.isAuthenticated()) {
        console.log('Autenticado');
        console.log('Tienes una sesión activa, si quieres iniciar sesión con otra cuenta termina esta sesión primero');
        return res.redirect('/eventos');
    }
    res.render('./auth/login', { page: 'login' });
});

router.post('/iniciar_sesion', passport.authenticate('local', { failureFlash: true, failureRedirect: '/iniciar_sesion' }), (req, res) => {
    console.log('Sesión iniciada ' + req.user.name);
    res.redirect('/eventos');
});

router.get('/cerrar_sesion', (req, res) => {
    req.logout((e) => {
        if (e) {
            console.log('Error: ' + e.message);
        }
        res.redirect('/eventos');
    });
});

router.get('/mi_info', isLoggedIn, isNew, (req, res) => {
    res.render('./auth/info');
});

router.post('/mi_info', isLoggedIn, isNew, async (req, res) => {
    const [user, e_user] = await handle(User.findOne({ _id: req.user._id }).exec());

    if (e_user || user === null) {
        console.log(e_user);
        return;
    }
    user.profile_name = req.body.profile_name;
    user.location = req.body.location;
    user.contact = req.body.contact;
    user.about_me = req.body.about_me;

    const [_, e_user_saved] = await handle(user.save());

    if (e_user_saved) {
        console.log(e_user_saved);
        return;
    }

    console.log('Informacion guardada');
    res.redirect('/eventos');
});

router.get('/perfil', isLoggedIn, (req, res) => {
    res.render('./auth/profile');
});

module.exports = router;