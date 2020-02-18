var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
commander_1.default.version("0.1.0");
commander_1.default
    .command("dev")
    .description("run dev server")
    .option("-p, --port <port>", "port to listen", 3002)
    .option("-H, --host <host>", "port to listen", "127.0.0.1")
    .action(require("./command/dev").default);
commander_1.default
    .command("build")
    .description("make a production build")
    .action(require("./command/build").default);
commander_1.default
    .command("start")
    .description("run the server")
    .action(require("./command/start").default);
if (!process.argv.slice(2).length) {
    commander_1.default.outputHelp();
}
commander_1.default.parse(process.argv);
//# sourceMappingURL=index.js.map