module.exports = {
    devtool: 'source-map',
    entry: {
        filename: './js/app.js'
    },
    output: {
        filename: 'bundle.js'
    },
    module: {
        rules: [
          { test: /\.(js)$/,
           exclude: /node_modules/,
           use: 'babel-loader' }
        ]
      }
}