"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("../../util/path");
exports.gatherRESTRoutes = async (cacheDir) => await path_1.gatherFile(cacheDir, ["**", "!(_)*.js"], [["**/_*/**/*"], ["**/*.d.js"]]);
//# sourceMappingURL=common.js.map