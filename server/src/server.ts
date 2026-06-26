import 'dotenv/config';
import { app } from './app';
import { env } from './env';
import { db } from './db';

const server = app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server running on http://localhost:${env.PORT}`);
});

// Graceful shutdown: close HTTP connections and flush SQLite WAL before exit.
// Critical in Docker so that SIGTERM from `docker stop` doesn't corrupt the DB.
function shutdown(signal: string): void {
  // eslint-disable-next-line no-console
  console.log(`${signal} received – shutting down gracefully...`);
  server.close(() => {
    try {
      db.close();
    } catch {
      // ignore close errors during shutdown
    }
    process.exit(0);
  });

  // Force-exit if graceful shutdown takes too long (10 s).
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
