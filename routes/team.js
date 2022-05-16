const express = require('express');
const router = express.Router();
let teamController = require('../controllers/teamController');

let teams = teamController.teams();

router.get('/', (req, res) => {
  res.render('team', {
    teams
  });
});

module.exports = router;