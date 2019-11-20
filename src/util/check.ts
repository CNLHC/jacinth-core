import { getPagesDir, getServerDir } from "./path";
import chalk from "chalk";
import del from "del";
import { getEnv } from "../env";
import { logger } from "./logging";

export default function preCheck(ctx?: any) {
  const cwd = process.cwd();
  const env = getEnv();

  if (ctx?.command === "dev") {
    logger.debug("clean the cache dir");
    del(env.cacheDir);
  }

  getPagesDir(cwd).then(e => {
    if (!e) {
      console.error(chalk.red("can not find pages dir"));
      process.exit(1);
    }
  });

  getServerDir(cwd).then(e => {
    if (!e) {
      console.error(chalk.red("can not find server dir"));
      process.exit(1);
    }
  });
}
