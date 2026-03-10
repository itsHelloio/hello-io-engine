import type { HelloIoPluginApi } from "hello-io/plugin-sdk/synology-chat";
import { emptyPluginConfigSchema } from "hello-io/plugin-sdk/synology-chat";
import { createSynologyChatPlugin } from "./src/channel.js";
import { setSynologyRuntime } from "./src/runtime.js";

const plugin = {
  id: "synology-chat",
  name: "Synology Chat",
  description: "Native Synology Chat channel plugin for HelloIo",
  configSchema: emptyPluginConfigSchema(),
  register(api: HelloIoPluginApi) {
    setSynologyRuntime(api.runtime);
    api.registerChannel({ plugin: createSynologyChatPlugin() });
  },
};

export default plugin;
