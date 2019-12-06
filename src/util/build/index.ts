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

export const transformFile = async (
  baseDir: string,
  fullPath: string,
  outDir: string
) => {
  const fileName = path
    .basename(fullPath)
    .split(".")
    .slice(0, -1)
    .join(".");

  const relativePath = path.dirname(path.relative(baseDir, fullPath));
  await compile(fullPath, {
    outPath: path.join(outDir, relativePath, `${fileName}.js`),
  });
};

export const transformDir = async (srcDir: string, outDir: string) => {
  const tFileSet = new Set([...(await gF(srcDir, ["**", "*.ts"]))]);
  tFileSet.forEach(async e => await transformFile(srcDir, e, outDir));
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
