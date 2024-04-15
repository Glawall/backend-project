const express = require("express")
const {getHealthResponse, getApiInformation} = require("./controllers/api-controller")
const {getTopics} = require("./controllers/topics-controller")
const {getArticles} = require("./controllers/articles-controller")


const app = express()

app.get("/api/healthcheck", getHealthResponse)

app.get("/api/topics", getTopics)

app.get("/api", getApiInformation)

app.get("/api/articles/:article_id", getArticles)



// errors

app.use((err, res, req, next) => {
    res.status(500).send("internal server error")
})

module.exports = app