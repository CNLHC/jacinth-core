import preCheck from "../util/check";
import { initEnv } from "../env";
import server from "../server";
import { logger } from "../util/logging";

export default async (args: any) => {
  preCheck();
  initEnv(args, { port: 3000, host: "0.0.0.0" });
  process.env.NODE_ENV = "production";
  server()
    .then(() => logger.info("Server Start"))
    .catch(err => {
      logger.error("Server exit unexpectedly", err);
      process.exit(-1);
    });
};
