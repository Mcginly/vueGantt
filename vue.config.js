module.exports = {
  assetsDir: 'content/js/static',
  configureWebpack: {
    output: {
      filename: 'content/js/static/js/[name].portal.js',
      chunkFilename: 'content/js/static/js/[id].portal.js'
    }
  }
}
