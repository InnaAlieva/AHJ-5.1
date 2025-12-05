const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './public', // Укажите путь к статическим файлам
    historyApiFallback: true,
    open: true,
    compress: true,
    port: 9000,
    client: {
      logging: 'info',
      overlay: true, // Показывает ошибки в браузере
    },
    watchFiles: ['src/**/*', 'public/**/*'], // Отслеживает изменения
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  performance: {
    hints: false, // Отключает предупреждения о размере бандла
  },
});
