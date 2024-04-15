const {fetchTopics} = require("../models/topics-model.js")

const getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics});
})
.catch((err) => {
    console.log(err)
    next(err)
})
}



module.exports = {getTopics}