var express = require('express')
var router = express.Router()
var request = require('request');
require('dotenv').load();

router.get('/', function (req, res) {
  var terms = []
  var url = `https://sandbox.tinypass.com/api/v3/publisher/term/list?aid=${process.env.PIANO_AID}&api_token=${process.env.PIANO_API_TOKEN}`
  request(url, function (error, response, body) {
    if (error) res.render("index")
    var data = JSON.parse(response.body)
    var termData = data.terms

    termData.forEach(term => {
      term.custom_default_access_period = (term.custom_default_access_period / 86400)
      if (term.type == 'custom') {
        terms.push(term)
      }
    });
    res.render('index', { terms: terms })
  });
})

router.post('/', function (req, res) {
  var url = `https://sandbox.tinypass.com/api/v3/publisher/conversion/custom/create?aid=${process.env.PIANO_AID}&api_token=${process.env.PIANO_API_TOKEN}&term_id=${req.body.term_id}&uid=${req.body.user_id}`
  request(url, function (error, response, body) {
    var data = JSON.parse(response.body)
    if (data.code !== 0) {
      console.log(data.message)
      res.send(data.message)
    } else {
      console.log(data)
      res.send("Success!")
    }
  });
})

module.exports = router 