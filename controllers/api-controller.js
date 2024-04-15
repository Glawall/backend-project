const endpoints = require("../endpoints.json")


const getHealthResponse = (req, res, next) => {
    res.status(200).send()
}

const getApiInformation = (req,res, next) => {
    res.status(200).send({endpoints})
}

module.exports = {getHealthResponse, getApiInformation}