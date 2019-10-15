const path = require("path");

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : './',
  pluginOptions: {
    quasar: {
      rtlSupport: true,
      treeShake: true
    }
  },
  transpileDependencies: [
    /[\\\/]node_modules[\\\/]quasar[\\\/]/
  ],
  devServer: {
    host: '0.0.0.0', 
    port: 3000
  },
  outputDir: './dist/',
  chainWebpack: config => {
    config
      .entry("app")
      .clear()
      .add("./src/main.ts")
      .end();
    config.resolve.alias
      .set("@/*", path.join(__dirname, "./src/*"))
  }
}
