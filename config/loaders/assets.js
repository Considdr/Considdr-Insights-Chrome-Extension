var fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];

module.exports = {
    test: new RegExp('\.(' + fileExtensions.join('|') + ')$'),
    loader: "file-loader?name=[name].[ext]"
}