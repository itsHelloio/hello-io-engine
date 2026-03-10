import { createPluginRuntimeStore } from "hello-io/plugin-sdk/compat";
import type { PluginRuntime } from "hello-io/plugin-sdk/irc";

const { setRuntime: setIrcRuntime, getRuntime: getIrcRuntime } =
  createPluginRuntimeStore<PluginRuntime>("IRC runtime not initialized");
export { getIrcRuntime, setIrcRuntime };
