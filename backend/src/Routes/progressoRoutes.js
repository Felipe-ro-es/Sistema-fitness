const router = require('express').Router();
const auth = require('../Middlewares/authMiddleware');
const { listar, registrar } = require('../controllers/progressoController');

router.get('/', auth, listar);
router.post('/', auth, registrar);

module.exports = router;
