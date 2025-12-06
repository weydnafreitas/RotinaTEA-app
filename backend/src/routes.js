const express = require('express');
const AuthController = require('./controllers/AuthController');
const ChildController = require('./controllers/ChildController');
const CategoryController = require('./controllers/CategoryController');
const TaskController = require('./controllers/TaskController');
const authMiddleware = require('./middlewares/authMiddleware');

const router = express.Router();

// Rotas Públicas -----------------------------------------------------------

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.use(authMiddleware);

// Rotas Privadas -----------------------------------------------------------

router.post('/child', ChildController.create);
router.get('/child', ChildController.list);

router.post('/categories', CategoryController.create);
router.get('/categories', CategoryController.list);

router.post('/tasks', TaskController.create);

// --------------------------------------------------------------------------

module.exports = router;