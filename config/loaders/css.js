/* 
    CSS loader
*/

const path = require("path")

module.exports = {
    test: /\.css$/,
    loader: "style-loader!css-loader",
    include: [
        path.join(__dirname, 'src'),
        /node_modules\/(semantic-ui-css)/
    ]
}