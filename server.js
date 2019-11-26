require('@babel/register');
/* eslint-disable no-console */
const cluster = require('cluster');
const os = require('os');
const app = require('./app');

if (cluster.isMaster && process.env.NODE_ENV === 'production') {
  const numWorkers = os.cpus().length;

  console.log(`Master cluster setting up ${numWorkers} workers...`);

  for (let i = 0; i < numWorkers; i += 1) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `Worker ${
        worker.process.pid
      } died with code: ${code}, and signal: ${signal}`,
    );
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  app.listen(process.env.APP_PORT || 3000, () => {
    console.log(`Process ${process.pid} is listening to all incoming requests`);
  });
}
