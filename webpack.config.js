var webpack = require("webpack"),
    path = require("path"),
    fileSystem = require("fs"),
    env = require("./utils/env"),
    CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin,
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    WriteFilePlugin = require("write-file-webpack-plugin");

// load the secrets
var alias = {};

var secretsPath = path.join(__dirname, ("secrets." + process.env.APP_ENV + ".js"));

var fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];

if (fileSystem.existsSync(secretsPath)) {
  alias["secrets"] = secretsPath;
}

var options = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    popup: path.join(__dirname, "src", "js", "popup.js"),
    background: path.join(__dirname, "src", "js", "background.js"),
    highlight: path.join(__dirname, "src", "js", "content_scripts", "highlight.js")
  },
  chromeExtensionBoilerplate: {
    notHotReload: ["highlight"]
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader",
        include: [
          path.join(__dirname, 'src'),
          /node_modules\/(semantic-ui-css)/
        ],
      },
      {
        test: /\.(scss|sass)$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: "[path]___[name]__[local]___[hash:base64:5]",
              }, 
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [require('autoprefixer')]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [
                  path.resolve(__dirname, '..', '..', 'src')
                ]
              }
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: new RegExp('\.(' + fileExtensions.join('|') + ')$'),
        loader: "file-loader?name=[name].[ext]",
        include: [
          path.join(__dirname, 'src'),
          /node_modules\/(semantic-ui-css)/
        ],
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions.map(extension => ("." + extension)).concat([".jsx", ".js", ".css", ".sass"])
  },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin(),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(["NODE_ENV"]),
    new CopyWebpackPlugin([{
      from: "src/manifest.json",
      transform: function (content, path) {
        // generates the manifest file using the package.json informations
        return Buffer.from(JSON.stringify({
          description: process.env.npm_package_description,
          version: process.env.npm_package_version,
          ...JSON.parse(content.toString())
        }))
      }
    }]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "popup.html"),
      filename: "popup.html",
      chunks: ["popup"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "background.html"),
      filename: "background.html",
      chunks: ["background"]
    }),
    new WriteFilePlugin()
  ]
};

if (env.NODE_ENV === "development") {
  options.devtool = "cheap-module-eval-source-map";
}

module.exports = options;
