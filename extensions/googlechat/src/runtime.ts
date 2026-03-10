import { createPluginRuntimeStore } from "hello-io/plugin-sdk/compat";
import type { PluginRuntime } from "hello-io/plugin-sdk/googlechat";

const { setRuntime: setGoogleChatRuntime, getRuntime: getGoogleChatRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Google Chat runtime not initialized");
export { getGoogleChatRuntime, setGoogleChatRuntime };
