const {fetchUsers, fetchUser, checkUserExists} = require("../models/users-models")

const getUsers = (req,res,next) => {
    fetchUsers().then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
        next(err)
    })
}

const getUser = (req,res,next) => {
    const {username} = req.params
    Promise.all([fetchUser(username), checkUserExists(username)]).then(([user]) => {
        res.status(200).send({user})
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {getUsers, getUser}