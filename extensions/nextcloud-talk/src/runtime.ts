import { createPluginRuntimeStore } from "hello-io/plugin-sdk/compat";
import type { PluginRuntime } from "hello-io/plugin-sdk/nextcloud-talk";

const { setRuntime: setNextcloudTalkRuntime, getRuntime: getNextcloudTalkRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Nextcloud Talk runtime not initialized");
export { getNextcloudTalkRuntime, setNextcloudTalkRuntime };
