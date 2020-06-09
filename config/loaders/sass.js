const path = require("path")

module.exports = {
    test: /\.(scss|sass)$/i,
    use: [
        {
            loader: 'style-loader'
        },
        {
            loader: 'css-loader',
            options: {
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
                sourceMap: process.env.NODE_ENV === 'development'
            }
        }
    ],
    exclude: /node_modules/
  }