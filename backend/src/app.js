require('dotenv').config({ path: require('path').join(__dirname, '../.env'), override: true });
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const planoTreinoRoutes = require('./routes/planoTreinoRoutes');
const planoAlimentarRoutes = require('./routes/planoAlimentarRoutes');
const progressoRoutes = require('./routes/progressoRoutes');
const errorMiddleware = require('./Middlewares/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/auth', authRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/plano-treino', planoTreinoRoutes);
app.use('/plano-alimentar', planoAlimentarRoutes);
app.use('/progresso', progressoRoutes);

app.use(errorMiddleware);

module.exports = app;
