export default {
  files: [".test/test/**/*", "!.test/test/_*/**/*"],
  compileEnhancements: false,
  extensions: ["ts"],
  require: ["ts-node/register"],
};
