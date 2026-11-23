import { startWorkers } from './start';

try {
  startWorkers();
} catch (error) {
  console.error(error);
  process.exit(1);
}
