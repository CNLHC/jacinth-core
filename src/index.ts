import program from "commander";

program.version("0.1.0");

program
  .command("dev")
  .description("run dev server")
  .option("-p, --port <port>", "port to listen", 3002)
  .option("-H, --host <host>", "port to listen", "127.0.0.1")
  .action(require("./command/dev").default);

program
  .command("build")
  .description("make a production build")
  .action(require("./command/build").default);

program
  .command("start")
  .description("run the server")
  .action(require("./command/start").default);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
program.parse(process.argv);
