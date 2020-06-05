const path = require("path");
const outputPath = path.resolve(__dirname, "dist");

module.exports = {
  mode: "development",
  entry: "./src/app.tsx",
  output: {
    path: outputPath,
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
          {
            loader: "eslint-loader",
            options: {
              emitError: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { url: false },
          },
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  devServer: {
    contentBase: outputPath,
    open: false,
    port: 8081,
  },
};
