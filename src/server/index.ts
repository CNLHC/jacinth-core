#!/usr/bin/env node
import fastify from "fastify";
import chalk from "chalk";
import { getEnv } from "../env/index";
import { logger } from "../util/logging";
import pluginLoader from "./loader/plugin";
import restLoader from "./loader/rest";
import path from "path";

let serverRunning = false;
let server = fastify({
  pluginTimeout:100000
});
const dev = process.env.NODE_ENV !== "production";

export default async () => {
  logger.debug(`reload bff under ${dev ? "dev" : "production"} mode`);
  const env = getEnv();
  // if there already have one instance running, kill it and get a new one
  if (serverRunning) {
    server.close();
    server = fastify({});
  }

  server.register((await import("fastify-multipart")).default);

  const pluginCacheDir = dev
    ? env.pluginCacheDir
    : path.resolve(env.distDir, "plugin");

  server.register(pluginLoader, { cacheDir: pluginCacheDir });

  server.after(async () => {
    const RESTCacheDir = dev
      ? env.RESTCacheDir
      : path.resolve(env.distDir, "rest");

    server.register(restLoader, { cacheDir: RESTCacheDir, prefix: "/api" });
    server.register((await import("./plugins/next")).default);
  });

  const address = await server.listen(env.port, env.host);
  logger.info(chalk.green(`server available at ${address}`));
  serverRunning = true;
  return serverRunning;
};
