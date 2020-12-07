const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    res.send("How ya doing");
});

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get('/:code/:scope', function (req, res) {
    res.send("Hello Code")
})