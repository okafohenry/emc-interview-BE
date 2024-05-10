const express = require('express');
const router = express.Router();

const {
  index,
  overview,
  notifications,
  notification,
  createNew,
  Users,
  user
} = require('../controllers/user.controller');
const { protect } = require('../middleware');

router.post('/notification', createNew);

router.use(protect);

router.get('/profile', index);
router.get('/overview', overview);
router.get('/users', Users);
router.get('/user/:id', user);
router.get('/notifications', notifications);
router.get('/notification/:id', notification);

module.exports = router;
