const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './tf_scraper.js',
  target: 'node',
  node: {
    fs: true
  },
  externals: [nodeExternals()],
  module: {
    rules: [
            {
      test: /\.js$/,
      loader: 'babel-loader',
      include: path.resolve(__dirname, 'src'),
      exclude: path.resolve(__dirname, 'node_modules'),
      query: {
            cacheDirectory: true,
            presets: ['react', 'env'] }
    }],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'scraper.bundle.js',
  },
};
