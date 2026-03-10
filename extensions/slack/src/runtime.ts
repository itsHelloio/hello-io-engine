import { createPluginRuntimeStore } from "hello-io/plugin-sdk/compat";
import type { PluginRuntime } from "hello-io/plugin-sdk/slack";

const { setRuntime: setSlackRuntime, getRuntime: getSlackRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Slack runtime not initialized");
export { getSlackRuntime, setSlackRuntime };
