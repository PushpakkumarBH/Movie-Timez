var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/seat', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/seatBooked', function(req, res, next) {
  res.send('respond with a resource');
});
module.exports = router;