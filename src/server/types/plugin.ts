import * as http from "http";
import * as https from "https";
import fastify from "fastify";

export type HttpServer = http.Server | https.Server;
export type RawRequest = http.IncomingMessage;
export type RawResponse = http.ServerResponse;

export type TPlugin<T extends {}> = fastify.Plugin<
  HttpServer,
  RawRequest,
  RawResponse,
  T,
  Function
>;

export type TMiddleWare = fastify.Middleware<
  HttpServer,
  fastify.FastifyRequest,
  fastify.FastifyReply<RawResponse>
>;
