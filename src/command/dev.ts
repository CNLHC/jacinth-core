import chokidar from "chokidar";
import debounce from "debounce";
import preCheck from "../util/check";
import { initEnv, getEnv } from "../env";
import { transformDir, transformFile } from "../util/build";
import { logger } from "../util/logging";
import server from "../server";
import { promisify } from 'util'
import del from "del";
import path from 'path'
import fs from "fs";
const lstat = promisify(fs.lstat)

type IArgs = any;
export default async (args: IArgs) => {
  await preCheck({ command: "dev" });
  await initEnv(args);
  const env = getEnv();
  const loadBFF = debounce(
    async () => {
      return await server();
    },
    200,
    true
  );
  const transformAll = debounce(
    async () => {
      await transformDir(env.serverDir, env.cacheDir);
    },
    200,
    true
  );

  const transformSingle = debounce(
    async (_path: string) => {
      await transformFile(env.serverDir, _path, env.cacheDir);
    },
    200,
    true
  );

  const removeCompiledPath = debounce(async (fp: string) => {
    logger.debug(`remove detected on ${fp}`)
    const relFP = path.relative(env.serverDir, fp)
    logger.debug(`relative fp ${relFP}`)
    const expiredFP = path.resolve(env.cacheDir, relFP)
    const fileStat = await lstat(expiredFP)

    if (fileStat.isFile()) {
      logger.debug(`remove expired file ${expiredFP}`);
      const ingredients = expiredFP.split(".");
      if (ingredients.length > 1)
        await del([...ingredients.slice(0, ingredients.length), ".*"].join(""));
    } else {
      // to del a directory ,append a slash behind the fp
      logger.debug(`remove expired directory ${expiredFP}`)
      await del(`${expiredFP}/`, {});
    }
  });

  logger.debug("Initially build the server side file");
  await transformAll();
  await loadBFF();

  try {
    chokidar.watch(env.cacheDir).on("change", loadBFF);
    chokidar
      .watch(env.serverDir)
      .on("change", transformSingle)
      .on("add", transformSingle)
      .on("unlink", removeCompiledPath)
      .on("unlinkDir", removeCompiledPath);
  } catch (e) {
    console.error("Some error occur", (e as Error).stack);
  }
};
