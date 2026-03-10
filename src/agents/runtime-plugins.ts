import type { HelloIoConfig } from "../config/config.js";
import { loadHelloIoPlugins } from "../plugins/loader.js";
import { resolveUserPath } from "../utils.js";

export function ensureRuntimePluginsLoaded(params: {
  config?: HelloIoConfig;
  workspaceDir?: string | null;
}): void {
  const workspaceDir =
    typeof params.workspaceDir === "string" && params.workspaceDir.trim()
      ? resolveUserPath(params.workspaceDir)
      : undefined;

  loadHelloIoPlugins({
    config: params.config,
    workspaceDir,
  });
}
