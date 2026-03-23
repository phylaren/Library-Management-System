import app from './app';

const startServer = async () => {
  app.listen(8080, () => {
    console.log(`- Сервер запущено: http://localhost:8080`);
  });
};

startServer();