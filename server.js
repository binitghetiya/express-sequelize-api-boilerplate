require("babel-register")({
  presets: ["es2015"]
});

var app = require("./app");

var cluster = require("cluster");

if (cluster.isMaster) {
  var numWorkers = require("os").cpus().length;

  console.log("Master cluster setting up " + numWorkers + " workers...");

  for (var i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on("online", function(worker) {
    console.log("Worker " + worker.process.pid + " is online");
  });

  cluster.on("exit", function(worker, code, signal) {
    console.log(
      "Worker " +
        worker.process.pid +
        " died with code: " +
        code +
        ", and signal: " +
        signal
    );
    console.log("Starting a new worker");
    cluster.fork();
  });
} else {
  console.log(process.env.APP_PORT);
  app.listen(process.env.APP_PORT || 3000, function() {
    console.log(
      "Process " + process.pid + " is listening to all incoming requests"
    );
  });
}
