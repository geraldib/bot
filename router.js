import express from 'express'
var app = express()


app.get('/', function (req, res) {
    res.send(req.params)
})

app.get('/:code/:scope', function (req, res) {
    res.send(req.params)
})