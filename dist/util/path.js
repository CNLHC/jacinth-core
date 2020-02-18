var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const glob_1 = __importDefault(require("glob"));
const getPath = async (cwd, ingredients) => {
    const dir = path_1.default.resolve(cwd, path_1.default.join(...ingredients));
    return new Promise(res => {
        fs_1.default.exists(dir, exists => res(exists ? dir : undefined));
    });
};
exports.getPagesDir = async (cwd) => await getPath(cwd, ["src", "pages"]);
exports.getServerDir = async (cwd) => await getPath(cwd, ["server"]);
exports.getTscPath = async (cwd) => await getPath(cwd, ["node_modules", ".bin", "tsc"]);
exports.getJacinthRoot = () => path_1.default.resolve(path_1.default.join(__dirname, "..", ".."));
exports.unsafeGetPagesDir = async (cwd) => (await exports.getPagesDir(cwd));
exports.unsafeGetServerDir = async (cwd) => (await exports.getServerDir(cwd));
exports.gatherFile = async (baseDir, pattern, ignore = []) => {
    return new Promise((res, rej) => glob_1.default(path_1.default.join(baseDir, ...pattern), {
        ignore: ignore.length > 0 ? ignore.map(e => path_1.default.join(baseDir, ...e)) : undefined,
    }, (err, matches) => {
        if (err)
            rej(err);
        res(matches);
    }));
};
//# sourceMappingURL=path.js.map