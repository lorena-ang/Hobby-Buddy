const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const { resolveInclude } = require('ejs');

var router = express.Router();

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
                return res.redirect('/eventos');
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

module.exports = router;