import type { HelloIoPluginApi } from "hello-io/plugin-sdk/discord";
import { emptyPluginConfigSchema } from "hello-io/plugin-sdk/discord";
import { discordPlugin } from "./src/channel.js";
import { setDiscordRuntime } from "./src/runtime.js";
import { registerDiscordSubagentHooks } from "./src/subagent-hooks.js";

const plugin = {
  id: "discord",
  name: "Discord",
  description: "Discord channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: HelloIoPluginApi) {
    setDiscordRuntime(api.runtime);
    api.registerChannel({ plugin: discordPlugin });
    registerDiscordSubagentHooks(api);
  },
};

export default plugin;
