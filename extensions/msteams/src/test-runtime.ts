import os from "node:os";
import path from "node:path";
import type { PluginRuntime } from "hello-io/plugin-sdk/msteams";

export const msteamsRuntimeStub = {
  state: {
    resolveStateDir: (env: NodeJS.ProcessEnv = process.env, homedir?: () => string) => {
      const override = env.HELLO_IO_STATE_DIR?.trim() || env.HELLO_IO_STATE_DIR?.trim();
      if (override) {
        return override;
      }
      const resolvedHome = homedir ? homedir() : os.homedir();
      return path.join(resolvedHome, ".hello-io");
    },
  },
} as unknown as PluginRuntime;
