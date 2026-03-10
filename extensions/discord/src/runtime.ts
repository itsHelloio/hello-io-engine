import { createPluginRuntimeStore } from "hello-io/plugin-sdk/compat";
import type { PluginRuntime } from "hello-io/plugin-sdk/discord";

const { setRuntime: setDiscordRuntime, getRuntime: getDiscordRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Discord runtime not initialized");
export { getDiscordRuntime, setDiscordRuntime };
