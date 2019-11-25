import { TPlugin } from "../../../src/server/types/plugin";

const bar: TPlugin<{}> = async (app, _opt) => {
  app.post("/register", async () => ({ status: "ok" }));
};

export default bar;
