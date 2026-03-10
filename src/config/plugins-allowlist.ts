import type { HelloIoConfig } from "./config.js";

export function ensurePluginAllowlisted(cfg: HelloIoConfig, pluginId: string): HelloIoConfig {
  const allow = cfg.plugins?.allow;
  if (!Array.isArray(allow) || allow.includes(pluginId)) {
    return cfg;
  }
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      allow: [...allow, pluginId],
    },
  };
}
