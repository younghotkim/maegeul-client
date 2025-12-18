import packageJson from "../package.json";

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: "매글: 매일 글쓰기",
  appVersion: packageJson.version,
};
