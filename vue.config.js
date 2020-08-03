module.exports = {
  assetsDir: 'content/js/static',
  configureWebpack: {
    output: {
      filename: 'content/js/static/js/[name].biview.js',
      chunkFilename: 'content/js/static/js/[id].biview.js'
    }
  }
}
