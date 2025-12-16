require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use(routes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API RotinaTEA funcionando!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});