import { createPluginRuntimeStore } from "hello-io/plugin-sdk/compat";
import type { PluginRuntime } from "hello-io/plugin-sdk/synology-chat";

const { setRuntime: setSynologyRuntime, getRuntime: getSynologyRuntime } =
  createPluginRuntimeStore<PluginRuntime>(
    "Synology Chat runtime not initialized - plugin not registered",
  );
export { getSynologyRuntime, setSynologyRuntime };
