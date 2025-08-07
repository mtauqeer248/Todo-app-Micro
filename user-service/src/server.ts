import app from './app';
import { connectDatabase } from './config/database';

const PORT = process.env['PORT'] || 3001;

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {

    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();