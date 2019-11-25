#!/usr/bin/env node
import fastify from "fastify";
import chalk from "chalk";
import { getEnv } from "../env/index";
import { logger } from "../util/logging";
import pluginLoader from "./loader/plugin";
import restLoader from "./loader/rest";

let serverRunning = false;
let server = fastify({});
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

  server.register(pluginLoader, { cacheDir: env.pluginCacheDir });

  server.after(async () => {
    server.register(restLoader, { cacheDir: env.RESTCacheDir, prefix: "/api" });
    server.register((await import("./plugins/next")).default);
  });

  const address = await server.listen(env.port, env.host);
  logger.info(chalk.green(`server available at ${address}`));
  serverRunning = true;
  return serverRunning;
};
