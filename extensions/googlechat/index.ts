import type { HelloIoPluginApi } from "hello-io/plugin-sdk/googlechat";
import { emptyPluginConfigSchema } from "hello-io/plugin-sdk/googlechat";
import { googlechatDock, googlechatPlugin } from "./src/channel.js";
import { setGoogleChatRuntime } from "./src/runtime.js";

const plugin = {
  id: "googlechat",
  name: "Google Chat",
  description: "HelloIo Google Chat channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: HelloIoPluginApi) {
    setGoogleChatRuntime(api.runtime);
    api.registerChannel({ plugin: googlechatPlugin, dock: googlechatDock });
  },
};

export default plugin;
