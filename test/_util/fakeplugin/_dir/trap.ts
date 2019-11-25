import { TPlugin } from "../../../../src/server/types/plugin";
import fp from "fastify-plugin";

const JacinthDAL: TPlugin<any> = (app, _opt, next) => {
  app.decorate("nestedTrap", true);
  next();
};

export default fp(JacinthDAL);
