var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const glob_1 = __importDefault(require("glob"));
const getPath = (cwd, ingredients) => __awaiter(this, void 0, void 0, function* () {
    const dir = path_1.default.resolve(cwd, path_1.default.join(...ingredients));
    return new Promise(res => {
        fs_1.default.exists(dir, exists => res(exists ? dir : undefined));
    });
});
exports.getPagesDir = (cwd) => __awaiter(this, void 0, void 0, function* () { return yield getPath(cwd, ["src", "pages"]); });
exports.getServerDir = (cwd) => __awaiter(this, void 0, void 0, function* () { return yield getPath(cwd, ["server"]); });
exports.getTscPath = (cwd) => __awaiter(this, void 0, void 0, function* () { return yield getPath(cwd, ["node_modules", ".bin", "tsc"]); });
exports.getJacinthRoot = () => path_1.default.resolve(path_1.default.join(__dirname, "..", ".."));
exports.unsafeGetPagesDir = (cwd) => __awaiter(this, void 0, void 0, function* () { return (yield exports.getPagesDir(cwd)); });
exports.unsafeGetServerDir = (cwd) => __awaiter(this, void 0, void 0, function* () { return (yield exports.getServerDir(cwd)); });
exports.gatherFile = (baseDir, pattern, ignore = []) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((res, rej) => glob_1.default(path_1.default.join(baseDir, ...pattern), {
        ignore: ignore.length > 0
            ? ignore.map(e => path_1.default.join(baseDir, ...e))
            : undefined,
    }, (err, matches) => {
        if (err)
            rej(err);
        res(matches);
    }));
});
//# sourceMappingURL=path.js.map