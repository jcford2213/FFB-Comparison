const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('calculator');
});

module.exports = router;