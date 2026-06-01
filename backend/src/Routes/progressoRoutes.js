const router = require('express').Router();
const auth = require('../Middlewares/authMiddleware');
const upload = require('../Middlewares/upload');
const { listar, registrar, deletar } = require('../controllers/progressoController');

router.get('/', auth, listar);
router.post('/', auth, upload.array('fotos', 3), registrar);
router.delete('/:id', auth, deletar);

module.exports = router;
