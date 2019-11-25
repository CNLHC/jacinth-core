import { TPlugin } from "../../../src/server/types/plugin";

const foo: TPlugin<{}> = async (app, _opt) => {

  app.post("/login2", async (_req, _p) => ({ name: "login" }));

  app.post("/logout2", async (_req, _p) => ({ name: "logout" }));

  app.post("/checks2", async (_req, _p) => ({ name: "check" }));

};

export default foo;
