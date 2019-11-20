import { transformFileAsync } from "@babel/core";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { logger } from "../logging";
import { gatherFile as gF } from "../path";

const write = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

type IOpt = {
  outPath: string;
};

export const transformDir = async (srcDir: string, outDir: string) => {
  const tFileSet = new Set([...(await gF(srcDir, ["**", "*.ts"]))]);
  tFileSet.forEach(e => {
    logger.debug(`compile server file ${e}`);

    const fileName = path
      .basename(e)
      .split(".")
      .slice(0, -1)
      .join(".");

    const relativePath = path.dirname(path.relative(srcDir, e));

    compile(e, {
      outPath: path.join(outDir, relativePath, `${fileName}.js`),
    });
  });
  return tFileSet;
};

export async function compile(source: string, opts: IOpt) {
  let output;
  try {
    output = await transformFileAsync(source, {
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
  } catch (e) {
    logger.error(e.message);
  } finally {
    const outDir = path.dirname(opts.outPath);
    if (!(await exists(outDir))) await mkdir(outDir, { recursive: true });

    if (output) write(opts.outPath, output.code);
  }
}
