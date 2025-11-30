const express = require('express');
const AuthController = require('./controllers/AuthController');
const ChildController = require('./controllers/ChildController');
const authMiddleware = require('./middlewares/authMiddleware');

const router = express.Router();

// Rotas Públicas
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.use(authMiddleware);

// Rotas Privadas
router.post('/child', ChildController.create);

module.exports = router;