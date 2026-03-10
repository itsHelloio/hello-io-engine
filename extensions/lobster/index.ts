import type {
  AnyAgentTool,
  HelloIoPluginApi,
  HelloIoPluginToolFactory,
} from "hello-io/plugin-sdk/lobster";
import { createLobsterTool } from "./src/lobster-tool.js";

export default function register(api: HelloIoPluginApi) {
  api.registerTool(
    ((ctx) => {
      if (ctx.sandboxed) {
        return null;
      }
      return createLobsterTool(api) as AnyAgentTool;
    }) as HelloIoPluginToolFactory,
    { optional: true },
  );
}
