const express = require('express');
const photoRoutes = require('./photo.routes');

const router = express.Router();

router.use('/photos', photoRoutes);

module.exports = router;
