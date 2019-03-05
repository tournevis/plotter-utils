// 1. npm init
// 2. npm install --save
// 3. mkdir dist && touch index.html
// 4. Include `<script src='/bundle.js'></script>` inside index.html
// 5. mkdir src && touch src/index.js
// 6. Add some code to index.js (e.g. `console.log('Hello, World!'))
// 7. npm start
// 8. Browse to http://localhost:8080/dist/

const path = require('path')
module.exports = function(env) {

const APP_DIR_NAME = env.project

  const APP_DIR = path.resolve(__dirname, `./src/${APP_DIR_NAME}`)

  return {
    entry: APP_DIR + '/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    },
    module: {
      rules:  [{
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
  	  }],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'lib/')
      }
    },
    devServer: {
      historyApiFallback: true,
      noInfo: true,
      overlay: true
    },
    mode:'development',
    devtool: '#eval-source-map'
  }
}