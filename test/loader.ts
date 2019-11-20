import test from "ava";
import path from "path";
import PluginLoader from "../src/server/loader/plugin";
import fastify from "fastify";

test("test rest loader function", async t => {
  const app = fastify({});
  app.register(PluginLoader, {
    cacheDir: path.resolve(__dirname, "_util", "fakeplugin"),
  });
  t.log(path.resolve(__dirname, "_util", "fakeplugin"));
  await new Promise<void>((resolve, _reject) => {
    app.ready(() => {
      t.true(app.probe());
      t.false(!!app.trap);
      resolve();
    });
  });
});
