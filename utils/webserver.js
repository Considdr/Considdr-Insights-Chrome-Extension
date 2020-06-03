var WebpackDevServer = require("webpack-dev-server"),
    ChromeExtensionReloader  = require('webpack-chrome-extension-reloader');
    webpack = require("webpack"),
    config = require("../webpack.config"),
    env = require("./env"),
    path = require("path");

var options = (config.chromeExtensionBoilerplate || {});
// var excludeEntriesToHotReload = (options.notHotReload || []);

// for (var entryName in config.entry) {
//   if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
//     config.entry[entryName] =
//       [
//         ("webpack-dev-server/client?http://localhost:" + env.PORT),
//         "webpack/hot/dev-server"
//       ].concat(config.entry[entryName]);
//   }
// }

config.plugins =
  [new ChromeExtensionReloader()].concat(config.plugins || []);

delete config.chromeExtensionBoilerplate;

var compiler = webpack(config);

var server =
  new WebpackDevServer(compiler, {
    contentBase: path.join(__dirname, "../build"),
    sockPort: env.PORT,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    disableHostCheck: true,
    proxy: {
      'http://localhost:8888/v1': 'http://localhost:8888'
    }
  });

server.listen(env.PORT);
