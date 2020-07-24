var path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/main.js",
  output: {
    path: path.resolve("dist"),
    filename: "main.js",
    libraryTarget: "commonjs2",
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: "babel-loader",
      },
      {
        test: /\.svg?$/,
        use: ["@svgr/webpack", "file-loader"],
      },
    ],
  },
};
