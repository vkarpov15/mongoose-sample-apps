module.exports = {
  entry: `${process.cwd()}/src/client/index.js`,
  output: {
    path: `${process.cwd()}/public`
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};