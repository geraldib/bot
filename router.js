var express = require('express')
var app = express()

app.get('/:code/:scope', function (req, res) {
    res.send(req.params)
})