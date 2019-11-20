"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_jwt_1 = __importDefault(require("fastify-jwt"));
const fastify_auth_1 = __importDefault(require("fastify-auth"));
const Test = async (app, _opt, done) => {
    await app.register(fastify_jwt_1.default, { secret: "supersecret" });
    await app.register(fastify_auth_1.default);
    const authByJWT = async function (req, _res, next) {
        const tJWT = this.jwt;
        const authPayload = typeof req.req.headers.auth === "string"
            ? req.req.headers.authorization
            : undefined;
        if (authPayload === undefined) {
            return next(new Error("Missing auth header"));
        }
        const verifyRes = await tJWT.verify(authPayload);
        console.log(verifyRes);
        next();
    };
    app.decorate("sayHello", authByJWT);
    done();
};
exports.default = Test;
//# sourceMappingURL=index.js.map