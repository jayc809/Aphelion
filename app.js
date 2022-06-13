const express = require("express")
const app = express()
const path = require("path")
const port = process.env.PORT || 4000

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV == "production") {
    app.use(express.static("./frontend/build"))
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "./frontend/build/index.html"))
    })
}

app.listen(port, (err) => {
    if (err) return console.log(err)
    console.log("server running on port: " + port)
})