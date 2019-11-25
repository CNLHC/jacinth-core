import test from "ava";
import path from "path";
import PluginLoader from "../src/server/loader/plugin";
import RestLoader from "../src/server/loader/rest";
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
      t.false(!!app.nestedTrap);
      resolve();
    });
  });
});

test("test hot reload disable cache", async t => {
  const app = fastify({});
  app.register(PluginLoader, {
    cacheDir: path.resolve(__dirname, "_util", "fakeplugin"),
  });
  t.log(path.resolve(__dirname, "_util", "fakeplugin"));
  await new Promise<void>((resolve, _reject) => {
    app.ready(() => {
      t.true(app.state() == 1);
      app.close();
      const newApp = fastify({});
      newApp.register(PluginLoader, {
        cacheDir: path.resolve(__dirname, "_util", "fakeplugin"),
      });
      newApp.ready(() => {
        t.true(newApp.state() == 1);
        resolve();
      });
      resolve();
    });
  });
});

test("test plugin loader error handle", async t => {
  const app = fastify({ pluginTimeout: 50 });
  app.register(PluginLoader, {
    cacheDir: path.resolve(__dirname, "_util", "errorplugin"),
  });
  await new Promise<void>((resolve, _reject) => {
    app.ready(err => {
      t.log(err);
      t.true(!!err);
      resolve();
    });
  });
});

test("test rest api load", async t => {
  const app = fastify({ pluginTimeout: 500 });
  app.register(RestLoader, {
    cacheDir: path.resolve(__dirname, "_util", "mockapi"),
    prefix: "/api",
  });

  t.true(
    JSON.parse(
      (
        await app.inject({
          method: "POST",
          url: "/api/login",
        })
      ).payload
    ).name === "login"
  );

  t.true(
    JSON.parse(
      (
        await app.inject({
          method: "POST",
          url: "/api/login2",
        })
      ).payload
    ).name === "login"
  );

  const res2 = await app.inject({
    method: "POST",
    url: "/api/register",
  });
  t.deepEqual(JSON.parse(res2.payload).status, "ok");
});
