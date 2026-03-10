import { createPluginRuntimeStore } from "hello-io/plugin-sdk/compat";
import type { PluginRuntime } from "hello-io/plugin-sdk/signal";

const { setRuntime: setSignalRuntime, getRuntime: getSignalRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Signal runtime not initialized");
export { getSignalRuntime, setSignalRuntime };
