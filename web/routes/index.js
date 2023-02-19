const router = require('express').Router();
const controller = require('../controller/index');
const { isLoggedIn, isAdmin } = require('../middleware/index');

router.post('/login', controller.login);

router.post('/signup', controller.signup);

router.post('/createStudent', controller.saveStudent);

router.post('/adminLogin', controller.adminLogin);

router.post('/createTeacher', controller.saveTeacher);

router.post('/people', controller.getPeople);

router.get('/download/:id', controller.downloadFile);

module.exports = router;
