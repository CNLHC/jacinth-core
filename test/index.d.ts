import * as http from "http";

declare module "fastify" {
  interface FastifyInstance<
    HttpServer = http.Server,
    HttpRequest = http.IncomingMessage,
    HttpResponse = http.ServerResponse
  > {
    probe: () => boolean;
    trap: boolean;
    state: () => number;
    nestedTrap: boolean;
  }
}
