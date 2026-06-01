'use strict';
const router = require('express').Router();
const { register, login } = require('../controllers/authPersonalController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;
