const express = require('express');
const router = express.Router();

const { updateLocals } = require('../middlewares/auth.middleware.js');

router.use(updateLocals)

router.get("/", (req, res, next) => {
  res.render("index");
});

const authRoutes = require('./auth.routes');
router.use('/auth', authRoutes);

const userRoutes = require('./user.routes');
router.use('/user', userRoutes);

module.exports = router;
