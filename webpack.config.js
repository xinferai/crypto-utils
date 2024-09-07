const path = require('path');

const browserConfig = {
  entry: './index.js',
  output: {
    filename: 'crypto-utils.browser.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd', // for compatibility with Node.js and browsers
    globalObject: 'this', // ensures correct output for both environments
    library: '@xinferai/crypto-utils',
  },
  resolve: {
    fallback: {
      crypto: false, // exclude 'crypto' for browser builds
    },
  },
  target: 'web', // specifies that the build is for browsers
  mode: 'production',
};

const nodeConfig = {
  entry: './index.js',
  output: {
    filename: 'crypto-utils.node.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
  target: 'node', // specifies that the build is for Node.js
  mode: 'production',
};

module.exports = [browserConfig, nodeConfig];
