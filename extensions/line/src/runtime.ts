import { createPluginRuntimeStore } from "hello-io/plugin-sdk/compat";
import type { PluginRuntime } from "hello-io/plugin-sdk/line";

const { setRuntime: setLineRuntime, getRuntime: getLineRuntime } =
  createPluginRuntimeStore<PluginRuntime>("LINE runtime not initialized - plugin not registered");
export { getLineRuntime, setLineRuntime };
