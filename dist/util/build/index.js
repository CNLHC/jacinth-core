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
const core_1 = require("@babel/core");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const logging_1 = require("../logging");
const path_2 = require("../path");
const write = util_1.promisify(fs_1.default.writeFile);
const exists = util_1.promisify(fs_1.default.exists);
const mkdir = util_1.promisify(fs_1.default.mkdir);
exports.transformFile = (baseDir, fullPath, outDir) => __awaiter(this, void 0, void 0, function* () {
    const ext = path_1.default
        .basename(fullPath)
        .split(".")
        .pop();
    if (ext !== "ts") {
        logging_1.logger.debug(`skip none typescript file ${fullPath}`);
        return;
    }
    const fileName = path_1.default
        .basename(fullPath)
        .split(".")
        .slice(0, -1)
        .join(".");
    const relativePath = path_1.default.dirname(path_1.default.relative(baseDir, fullPath));
    yield compile(fullPath, {
        outPath: path_1.default.join(outDir, relativePath, `${fileName}.js`),
    });
});
exports.transformDir = (srcDir, outDir) => __awaiter(this, void 0, void 0, function* () {
    const tFileSet = Array.from(new Set([...(yield path_2.gatherFile(srcDir, ["**", "*.ts"]))]));
    yield Promise.all(tFileSet.map(e => exports.transformFile(srcDir, e, outDir)));
    return tFileSet;
});
function compile(source, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        let output;
        try {
            output = yield core_1.transformFileAsync(source, {
                plugins: [require("@babel/plugin-transform-runtime")],
                presets: [
                    // [require("babel-preset-minify")],
                    [
                        require("@babel/preset-env"),
                        {
                            targets: {
                                node: 12,
                            },
                            modules: "commonjs",
                            forceAllTransforms: true,
                        },
                    ],
                    [require("@babel/preset-typescript")],
                ],
            });
        }
        catch (e) {
            logging_1.logger.error(e.message);
        }
        finally {
            const outDir = path_1.default.dirname(opts.outPath);
            if (!(yield exists(outDir)))
                yield mkdir(outDir, { recursive: true });
            if (output)
                write(opts.outPath, output.code);
        }
    });
}
exports.compile = compile;
//# sourceMappingURL=index.js.map