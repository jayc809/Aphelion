const express = require("express")
const app = express()
const path = require("path")
const port = process.env.PORT || 4000

// if (!process.env.NODE_ENV) {
    app.use(express.static("./frontend/build"))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "./frontend/build/index.html"))
    })
// }

app.listen(port, (err) => {
    if (err) return console.log(err)
    console.log("server running on port: " + port)
})