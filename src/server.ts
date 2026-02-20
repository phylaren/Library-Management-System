import app from './app';
import { db } from './storage/memoryStorage';

const startServer = async () => {
  await db.init();

  app.listen(8080, () => {
    console.log(`- Сервер запущено: http://localhost:8080`);
  });
};

startServer();