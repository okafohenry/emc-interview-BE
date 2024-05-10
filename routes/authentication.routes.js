const express = require('express');
const router = express.Router();

const {
  login,
  logout,
  register
} = require('../controllers/authentication.controller');
const { protect } = require('../middleware/');

router.post('/register/', register);
router.post('/login/', login);
router.get('/logout/', logout);

module.exports = router;
