const path = require('path');

module.exports = {
  entry: './browser.js',  // Entry point for browser build
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'browser.js',  // Output file
    library: '@xinferai/crypto-utils',
    libraryTarget: 'umd',  // UMD format to work in various environments
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',  // Optional: Use Babel if you need to transpile ES6+
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  target: ['web', 'es5'],  // Targeting web and ES5 for browser compatibility
  mode: 'production',  // Change to 'development' for non-minified output
  devtool: 'source-map'  // Enable source map generation
};
