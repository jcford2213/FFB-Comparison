const express = require('express');
const router = express.Router();
let teamController = require('../controllers/teamController');
const teams = teamController.teams();

router.get('/', (req, res) => {
  res.render('team', {
    teams
  });
}).post((rec, res) => {
  console.log(res);
});

module.exports = router;