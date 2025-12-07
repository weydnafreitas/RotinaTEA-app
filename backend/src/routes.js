const express = require('express');
const AuthController = require('./controllers/AuthController');
const ChildController = require('./controllers/ChildController');
const CategoryController = require('./controllers/CategoryController');
const TaskController = require('./controllers/TaskController');
const TechnicalInfoController = require('./controllers/TechnicalInfoController');
const NoteController = require('./controllers/NoteController');
const InviteController = require('./controllers/InviteController');
const authMiddleware = require('./middlewares/authMiddleware');

const router = express.Router();

// Rotas Públicas -----------------------------------------------------------

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.use(authMiddleware);

// Rotas Privadas -----------------------------------------------------------

router.post('/child', ChildController.create);
router.get('/child', ChildController.list);

router.post('/invite', InviteController.invite);

router.post('/categories', CategoryController.create);
router.get('/categories', CategoryController.list);

router.post('/tasks', TaskController.create);

router.post('/technical-info', TechnicalInfoController.create);
router.get('/technical-info/:childId', TechnicalInfoController.getByChild);
router.put('/technical-info/:id', TechnicalInfoController.update);
router.delete('/technical-info/:id', TechnicalInfoController.delete);

router.post('/notes', NoteController.create);
router.get('/notes/:childId', NoteController.getByChild);
router.put('/notes/:id', NoteController.update);
router.delete('/notes/:id', NoteController.delete);

// --------------------------------------------------------------------------

module.exports = router;