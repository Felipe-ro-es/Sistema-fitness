require('dotenv').config({ path: require('path').join(__dirname, '../.env'), override: true });
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const authPersonalRoutes = require('./routes/authPersonalRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const planoTreinoRoutes = require('./routes/planoTreinoRoutes');
const progressoRoutes = require('./routes/progressoRoutes');
const personalRoutes = require('./routes/personalRoutes');
const errorMiddleware = require('./Middlewares/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/auth', authRoutes);
app.use('/auth/personal', authPersonalRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/plano-treino', planoTreinoRoutes);
app.use('/progresso', progressoRoutes);
app.use('/personal', personalRoutes);

app.use(errorMiddleware);

module.exports = app;
