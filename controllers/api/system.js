var router = require('express').Router()

router.get('/api/uptime', async (req, res, next) => {

          var response = {
            "uptime" : require('os').uptime(),
          };
          res.json(response);
});

module.exports = router;
