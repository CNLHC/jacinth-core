import { gatherFile } from "../../util/path";

export const gatherRESTRoutes = async (cacheDir: string) =>
  await gatherFile(
    cacheDir,
    ["**", "!(_)*.js"],
    [["**/_*/**/*"], ["**/*.d.js"]]
  );
