const express = require('express');
// // const authUser = require('../controller/userController.js')

const router = express.Router();
router.post('/auth', (req, res) => {
    const { email, password } = req.body
    res.status(200).send(req.params)
});

module.exports = router;
