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

app.use((err, req, res, next) => {
    if(err.status && err.message){
        res.status(err.status).send({message: err.message})
    }
    next(err)
})

app.use((err, req, res, next)=> {
    if(err.code === "22P02"){
    res.status(400).send({message: "Bad request"})
    }
    next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send("internal server error")
})

module.exports = app