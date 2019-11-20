import path from "path";

function calRuntimeEnv(p: PresetEnv): IAbsolutePath {
  const getAbsolute = (s: string[]) => path.resolve(process.cwd(), ...s);
  return Object.entries(p.relativePath).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [k]: getAbsolute(v),
    }),
    {} as IAbsolutePath
  );
}

interface PresetEnv {
  port: number;
  host: string;
  relativePath: {
    serverDir: string[];
    serverTsConfPath: string[];
    cacheDir: string[];
    RESTCacheDir: string[];
    pluginCacheDir: string[];
    distDir: string[];
    rootDir: string[];
    nextPath: string[];
  };
}
const defaultPresetEnv: PresetEnv = {
  port: 3002,
  host: "localhost",
  relativePath: {
    cacheDir: [".jacinth"],
    RESTCacheDir: [".jacinth", "rest"],
    pluginCacheDir: [".jacinth", "plugin"],
    serverDir: ["server"],
    serverTsConfPath: ["server", "tsconfig.json"],
    distDir: ["public"],
    rootDir: [],
    nextPath: [".next"],
  },
};

type IAbsolutePath = { [key in keyof PresetEnv["relativePath"]]: string };

type Env = PresetEnv & IAbsolutePath;

const defaultEnv: Env = {
  ...defaultPresetEnv,
  ...calRuntimeEnv(defaultPresetEnv),
};

let __env: Env | undefined;

export function initEnv(
  args: { [key: string]: any },
  overrideDefault?: Partial<Env>
) {
  Object.keys(args).forEach(key =>
    args[key] === undefined ? delete args[key] : {}
  );

  const tEnv: PresetEnv = {
    ...{
      ...defaultPresetEnv,
      ...overrideDefault,
    },
    ...args,
  };
  __env = { ...tEnv, ...calRuntimeEnv(tEnv) };
}

export function getEnv(): Env {
  return __env === undefined ? defaultEnv : __env;
}
