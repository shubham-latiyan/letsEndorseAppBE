const express = require('express')
var router = express.Router();
const userController = require('../controller/userController')

router.get('/', function (req, res) {
    res.json({
        'API': '1.0'
    });
});

router.post('/usersSignUp', userController.signUpUsers);
router.post('/usersSignIn', userController.signInUsers);
router.post('/getUser', userController.getUser);
module.exports = router;