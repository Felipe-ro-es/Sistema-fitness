const router = require('express').Router();
const auth = require('../Middlewares/authMiddleware');
const upload = require('../Middlewares/upload');
const { listar, registrar } = require('../controllers/progressoController');

router.get('/', auth, listar);
router.post('/', auth, upload.array('fotos', 3), registrar);

module.exports = router;
