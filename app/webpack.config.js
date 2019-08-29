const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: {
    index: "./src/js/index.js",
    cia: "./src/js/cia.js"
  },
 /* optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "commons",
          chunks: "initial",
          minChunks: 2,
          minSize: 0
        }
      }
    },
    occurrenceOrder: true // To keep filename consistent between different modes (for example building only)
  },*/
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, "dist"),
  },
  /* module: {
     rules: [{
       test: /\.html$/,
       use: ['html-loader']
     }]
   },*/
  plugins: [
    new HTMLWebpackPlugin({
      inject: "false",
      chunks: ["index"],
      filename: "index.html",
      template: "./src/index.html",
    }),
    new HTMLWebpackPlugin({
      inject: "false",
      chunks: ["cia"],
      filename: "cia.html",
      template: "./src/cia.html",
    }),
    new CleanWebpackPlugin(),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};
