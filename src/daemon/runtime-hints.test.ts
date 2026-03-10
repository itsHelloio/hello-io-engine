import { describe, expect, it } from "vitest";
import { buildPlatformRuntimeLogHints, buildPlatformServiceStartHints } from "./runtime-hints.js";

describe("buildPlatformRuntimeLogHints", () => {
  it("renders launchd log hints on darwin", () => {
    expect(
      buildPlatformRuntimeLogHints({
        platform: "darwin",
        env: {
          HELLO_IO_STATE_DIR: "/tmp/hello-io-state",
          HELLO_IO_LOG_PREFIX: "gateway",
        },
        systemdServiceName: "hello-io-gateway",
        windowsTaskName: "HelloIo Gateway",
      }),
    ).toEqual([
      "Launchd stdout (if installed): /tmp/hello-io-state/logs/gateway.log",
      "Launchd stderr (if installed): /tmp/hello-io-state/logs/gateway.err.log",
    ]);
  });

  it("renders systemd and windows hints by platform", () => {
    expect(
      buildPlatformRuntimeLogHints({
        platform: "linux",
        systemdServiceName: "hello-io-gateway",
        windowsTaskName: "HelloIo Gateway",
      }),
    ).toEqual(["Logs: journalctl --user -u hello-io-gateway.service -n 200 --no-pager"]);
    expect(
      buildPlatformRuntimeLogHints({
        platform: "win32",
        systemdServiceName: "hello-io-gateway",
        windowsTaskName: "HelloIo Gateway",
      }),
    ).toEqual(['Logs: schtasks /Query /TN "HelloIo Gateway" /V /FO LIST']);
  });
});

describe("buildPlatformServiceStartHints", () => {
  it("builds platform-specific service start hints", () => {
    expect(
      buildPlatformServiceStartHints({
        platform: "darwin",
        installCommand: "hello-io gateway install",
        startCommand: "hello-io gateway",
        launchAgentPlistPath: "~/Library/LaunchAgents/com.hello-io.gateway.plist",
        systemdServiceName: "hello-io-gateway",
        windowsTaskName: "HelloIo Gateway",
      }),
    ).toEqual([
      "hello-io gateway install",
      "hello-io gateway",
      "launchctl bootstrap gui/$UID ~/Library/LaunchAgents/com.hello-io.gateway.plist",
    ]);
    expect(
      buildPlatformServiceStartHints({
        platform: "linux",
        installCommand: "hello-io gateway install",
        startCommand: "hello-io gateway",
        launchAgentPlistPath: "~/Library/LaunchAgents/com.hello-io.gateway.plist",
        systemdServiceName: "hello-io-gateway",
        windowsTaskName: "HelloIo Gateway",
      }),
    ).toEqual([
      "hello-io gateway install",
      "hello-io gateway",
      "systemctl --user start hello-io-gateway.service",
    ]);
  });
});
