import preCheck from "../util/check";
import build from "next/dist/build";
import { initEnv, getEnv } from "../env";
import fs from "fs";
import path from "path";
import { logger } from "../util/logging";
import { transformDir } from "../util/build";
import { promisify } from "util";
import del from "del";
const mv = promisify(fs.rename);

export default async (args: any) => {
  preCheck();
  initEnv(args);
  const env = getEnv();

  fs.mkdirSync(env.distDir, {
    recursive: true,
  });

  transformDir(env.serverDir, env.distDir).then(() =>
    logger.info("Server Build Complete")
  );
  const nextDistDir = path.resolve(env.distDir, ".next");
  await del(nextDistDir);
  await build(env.rootDir);
  await mv(env.nextPath, nextDistDir);
  logger.info("Client Build Complete");
};
