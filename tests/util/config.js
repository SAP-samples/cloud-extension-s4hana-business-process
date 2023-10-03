require('dotenv').config({path : "../../.env"})

module.exports = {
    "mock": {
        "url": process.env.mockUrl
    },
    "bp_app": {
        "home": process.env.ciService ? "" : process.env.appUrl+"#Shell-home",
        "main": process.env.ciService ? process.env.appMain : process.env.appUrl+"#fe-lrop-v4",
        "auth": process.env.appAuth
    }
}