import { TPlugin } from "../../../src/server/types/plugin";
import fp from "fastify-plugin";

const JacinthDAL: TPlugin<any> = (app, _opt, next) => {
throw new Error("import error");
  app.decorate("probe", () => true);
  next();
};

export default fp(JacinthDAL);
