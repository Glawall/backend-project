const express = require("express")
const {getHealthResponse, getApiInformation} = require("./controllers/api-controller")
const {getTopics} = require("./controllers/topics-controller")


const app = express()

app.use(express.json())

app.get("/api/healthcheck", getHealthResponse)

app.get("/api/topics", getTopics)

app.get("/api", getApiInformation)






// errors

app.use((err, res, req, next) => {
    res.status(500).send("internal server error")
})

module.exports = app