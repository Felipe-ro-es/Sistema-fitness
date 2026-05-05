const router = require('express').Router();
const auth = require('../Middlewares/authMiddleware');
const { getPerfil, getPerfilFisico, salvarPerfilFisico } = require('../controllers/usuarioController');

router.get('/me', auth, getPerfil);
router.get('/perfil-fisico', auth, getPerfilFisico);
router.post('/perfil-fisico', auth, salvarPerfilFisico);

module.exports = router;
