const { plugin } = require("learnpack/plugin")

module.exports = plugin({
    language: "html",
    compile: require('./compile'),
    test: require('./test'),
})