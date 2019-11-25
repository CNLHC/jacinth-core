import { TPlugin } from "../../../src/server/types/plugin";

const foo: TPlugin<{}> = async (app, _opt) => {

  app.post("/login", async (_req, _p) => ({ name: "login" }));

  app.post("/logout", async (_req, _p) => ({ name: "logout" }));

  app.post("/checks", async (_req, _p) => ({ name: "check" }));

};

export default foo;
