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

  server.register(require("fastify-multipart"));

  server.register(require("fastify-cookie"));
  server.register(require("fastify-session"), {
    cookieName: "sessionId",
    secret: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    cookie: { secure: false },
    expires: 1800000,
  });

  server.register(pluginLoader, { cacheDir: env.pluginCacheDir });

  server.after(() => {
    server.register(restLoader, { cacheDir: env.RESTCacheDir });
    server.register(require("./plugins/next"));
  });

  const address = await server.listen(env.port, env.host);
  logger.info(chalk.green(`server available at ${address}`));
  serverRunning = true;
  return serverRunning;
};
