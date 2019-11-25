import path from "path";
import fs from "fs";
import glob from "glob";
const getPath = async (cwd: string, ingredients: string[]) => {
  const dir = path.resolve(cwd, path.join(...ingredients));
  return new Promise<string | undefined>(res => {
    fs.exists(dir, exists => res(exists ? dir : undefined));
  });
};

export const getPagesDir = async (cwd: string) =>
  await getPath(cwd, ["src", "pages"]);
export const getServerDir = async (cwd: string) =>
  await getPath(cwd, ["server"]);
export const getTscPath = async (cwd: string) =>
  await getPath(cwd, ["node_modules", ".bin", "tsc"]);
export const getJacinthRoot = () =>
  path.resolve(path.join(__dirname, "..", ".."));

export const unsafeGetPagesDir = async (cwd: string) =>
  (await getPagesDir(cwd)) as string;

export const unsafeGetServerDir = async (cwd: string) =>
  (await getServerDir(cwd)) as string;

export const gatherFile = async (
  baseDir: string,
  pattern: string[],
  ignore: string[] = []
) => {
  return new Promise<string[]>((res, rej) =>
    glob(
      path.join(baseDir, ...pattern),
      {
        ignore: ignore.length > 0 ? path.join(baseDir, ...ignore) : undefined,
      },
      (err, matches) => {
        if (err) rej(err);
        res(matches);
      }
    )
  );
};
