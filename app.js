const express = require("express")
const {getHealthResponse} = require("./controllers/api-controller")
const {getTopics} = require("./controllers/topics-controller")


const app = express()

app.get("/api/healthcheck", getHealthResponse)

app.get("/api/topics", getTopics)






// errors

app.use((err, res, req, next) => {
    res.status(500).send("internal server error")
})

module.exports = app