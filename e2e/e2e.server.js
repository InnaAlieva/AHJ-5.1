const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../webpack.dev');

const PORT = 8087;

const compiler = webpack(config);

// Правильная сборка опций для devServer
const devServerOptions = {
  ...config.devServer, // Распространяем настройки из webpack.dev.js
  open: false,
  port: PORT
};

const runServer = async () => {
  try {
    // Создаём сервер
    const server = new WebpackDevServer(devServerOptions, compiler);

    console.log(`Starting server on port ${PORT}`);

    // Запускаем сервер
    await server.start();

    console.log('Server is running!');
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

runServer();
