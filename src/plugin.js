const { plugin } = require("./utils/index")

module.exports = plugin({
    language: "html",
    compile: require('./compile'),
    test: require('./test'),
})