"use strict";
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
exports.transformDir = async (srcDir, outDir) => {
    const tFileSet = new Set([...(await path_2.gatherFile(srcDir, ["**", "*.ts"]))]);
    tFileSet.forEach(e => {
        logging_1.logger.debug(`compile server file ${e}`);
        const fileName = path_1.default
            .basename(e)
            .split(".")
            .slice(0, -1)
            .join(".");
        const relativePath = path_1.default.dirname(path_1.default.relative(srcDir, e));
        compile(e, {
            outPath: path_1.default.join(outDir, relativePath, `${fileName}.js`),
        });
    });
    return tFileSet;
};
async function compile(source, opts) {
    let output;
    try {
        output = await core_1.transformFileAsync(source, {
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
        if (!(await exists(outDir)))
            await mkdir(outDir, { recursive: true });
        if (output)
            write(opts.outPath, output.code);
    }
}
exports.compile = compile;
//# sourceMappingURL=index.js.map