// routes/authentication.js
const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authentication.controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Endpoint pour l'authentification (login)
router.post('/login', authenticationController.login);

// Endpoint pour l'inscription (inscription)
router.post('/inscription', authenticationController.inscription);

// Endpoint pour vérifier si le nom d'utilisateur est disponible
router.get('/check-username/:username', authenticationController.checkUsername);

// Endpoint pour vérifier si l'adresse e-mail est disponible
router.get('/check-email/:email', authenticationController.checkEmail);

module.exports = router;
