// Narrow plugin-sdk surface for the bundled diffs plugin.
// Keep this list additive and scoped to symbols used under extensions/diffs.

export type { HelloIoConfig } from "../config/config.js";
export { resolvePreferredHelloIoTmpDir } from "../infra/tmp-hello-io-dir.js";
export type {
  AnyAgentTool,
  HelloIoPluginApi,
  HelloIoPluginConfigSchema,
  PluginLogger,
} from "../plugins/types.js";
