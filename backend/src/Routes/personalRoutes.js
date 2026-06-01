'use strict';
const router = require('express').Router();
const authPersonal = require('../Middlewares/authPersonalMiddleware');
const { listarPendentes, listarValidados, obter, validar, listarUsuarios } = require('../controllers/personalController');

router.get('/usuarios', authPersonal, listarUsuarios);
router.get('/planos/pendentes', authPersonal, listarPendentes);
router.get('/planos/validados', authPersonal, listarValidados);
router.get('/planos/:id', authPersonal, obter);
router.patch('/planos/:id/validar', authPersonal, validar);

module.exports = router;
