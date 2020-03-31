module.exports = {
  entry: `${process.cwd()}/src/client/index.js`,
  output: {
    path: `${process.cwd()}/public/js`
  },
  optimization: {
    minimize: false
  }
};