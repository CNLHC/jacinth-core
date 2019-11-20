import preCheck from "../util/check";
import { initEnv } from "../env";
import server from "../server";
import { logger } from "../util/logging";

export default async (args: any) => {
  preCheck();
  initEnv(args);
  process.env.NODE_ENV = "production";
  console.log("hi?");
  server()
    .then(() => logger.info("Server Terminated"))
    .catch(() => logger.error("Server exit unexpectedly"));
};
