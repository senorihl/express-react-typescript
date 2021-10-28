const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const multi = require("multi-loader");

const server = {
  entry: "./server/index.ts",
  target: "node",
  externals: [nodeExternals()],
  output: {
    path: path.resolve("dist"),
    filename: "server.js",
    clean: {
      keep: (asset) => {
        return `${asset}`.startsWith("public/");
      },
    },
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new webpack.DefinePlugin({
      __BASEPATH__: JSON.stringify(path.resolve(__dirname)),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: "babel-loader",
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.server.json",
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Does nothing
          "null-loader",
        ],
      },
    ],
  },
};

const app = {
  entry: { app: "./web/index.tsx" },
  devServer: {
    static: "./dist/public",
    hot: true,
  },
  output: {
    path: path.resolve("dist", "public"),
    filename: "[name].js",
    clean: {
      keep: (asset) => {
        return `${asset}`.indexOf("server") === 0;
      },
    },
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[name].css" }),
    new WebpackManifestPlugin({
      fileName: "assets-manifest.json",
      publicPath: "/assets/",
    }),
    new webpack.DefinePlugin({
      __BASEPATH__: JSON.stringify(path.resolve(__dirname)),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: "babel-loader",
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates CSS files & style tags
          multi("style-loader", MiniCssExtractPlugin.loader),
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
};

module.exports = (env, argv) => {
  let basePath = "";
  if (argv.mode === "development") {
    app.devtool = "source-map";
    basePath = path.resolve(__dirname);
  }

  if (argv.mode === "production") {
    app.output.filename = "[name]-[fullhash].js";
    app.plugins[0] = new MiniCssExtractPlugin({
      filename: "[name]-[fullhash].css",
    });
  }

  app.plugins.push(
    new webpack.DefinePlugin({
      __BASEPATH__: JSON.stringify(basePath),
    })
  );

  return [app, server];
};
