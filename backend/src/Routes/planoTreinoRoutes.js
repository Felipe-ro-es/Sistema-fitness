const router = require('express').Router();
const auth = require('../Middlewares/authMiddleware');
const { gerar, listar, obter, deletar } = require('../controllers/planoTreinoController');

router.post('/gerar', auth, gerar);
router.get('/', auth, listar);
router.get('/:id', auth, obter);
router.delete('/:id', auth, deletar);

module.exports = router;
