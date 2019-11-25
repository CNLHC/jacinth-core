import { TPlugin } from "../../../src/server/types/plugin";
import fp from "fastify-plugin";
let state = 1;

const JacinthDAL: TPlugin<any> = (app, _opt, next) => {
  app.decorate("state", () => state++);
  next();
};

export default fp(JacinthDAL);
