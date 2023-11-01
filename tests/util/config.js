require('dotenv').config({path : "../../.env"})

module.exports = {
    "mock": {
        "url": process.env.mockUrl
    },
    "bp_app": {
        "main": "",
        "auth": process.env.appAuth
    }
}