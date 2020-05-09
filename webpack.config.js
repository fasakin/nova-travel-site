const currentTask = process.env.npm_lifecycle_event;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fse = require('fs-extra')

//imported plugins to the webpack config 
const path = require("path");
const postCSSPlugins = [
  require("postcss-import"),
  require("postcss-mixins"),
  require("postcss-simple-vars"),
  require("postcss-nested"),
  require("postcss-hexrgba"),
  require("autoprefixer"),
];


//custom plugin for copying images
class RunAfterCompile {
apply(compiler){
compiler.hooks.done.tap('Copy images', () => {
  fse.copySync('./app/assets/images', './docs/assets/images')
})
}
}
//pages for enabling us to work with multiple html files
let pages = fse.readdirSync('./app').filter(file => file.endsWith('html')).map(page => new HtmlWebpackPlugin({
  filename:page,
  template: `./app/${page}`
}))

// config initials for dev
let cssConfig = {
    test: /\.css$/i,
    use: [
      "css-loader",
      { loader: "postcss-loader", options: { plugins: postCSSPlugins } },
    ],
  }
//common config for webpack either dev or build
let config = {
  entry: "./app/assets/scripts/App.js",
  plugins: pages
  
};

//config for dev
if (currentTask === "dev") {
    config.module = {
        rules: [
            {
                test: /\.css$/i,
                use: [
                 'style-loader',
                  "css-loader",
                  { loader: "postcss-loader", options: { plugins: postCSSPlugins } },
                ],
              }
        ]
      }
  config.output = {
    filename: "bundled.js",
    path: path.resolve(__dirname, "app"),
  };

  config.devServer = {
    before: function (app, server) {
      server._watch("./app/**/*.html");
    },
    contentBase: path.join(__dirname, "app"),
    hot: true,
    port: 3000,
    host: "0.0.0.0",
  };

  config.mode = "development";
}

//config for build 
if (currentTask === "build") {
    postCSSPlugins.push(require('cssnano'))
    config.module = {
        rules: [
            {
                test: /\.css$/i,
                use: [
                 MiniCssExtractPlugin.loader,
                  "css-loader",
                  { loader: "postcss-loader", options: { plugins: postCSSPlugins } },
                ],
              },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ["@babel/preset-env"]
                  }
                }
              }
        ]
      }

  config.output = {
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "docs")
  }
    config.mode = "production"
  config.optimization = {
    splitChunks: { chunks: "all" }
  }
  
  config.plugins.push(
    new CleanWebpackPlugin(), 
    new MiniCssExtractPlugin({filename: "styles.[chunkhash].css"}),
    new RunAfterCompile())
}


//export our config
module.exports = config;
