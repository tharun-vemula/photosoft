const router = require('express').Router();
const controller = require('../controller/index');
const middleware = require('../middleware/index');

router.post('/login', controller.login);

router.post('/signup', controller.signup);

router.post('/createStudent', middleware, controller.saveStudent);
