import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs([
      "node",
      "hello-io",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "hello-io", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "hello-io", "--dev", "gateway"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "hello-io", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "hello-io", "--profile", "work", "status"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "hello-io", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "hello-io", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it.each([
    ["--dev first", ["node", "hello-io", "--dev", "--profile", "work", "status"]],
    ["--profile first", ["node", "hello-io", "--profile", "work", "--dev", "status"]],
  ])("rejects combining --dev with --profile (%s)", (_name, argv) => {
    const res = parseCliProfileArgs(argv);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join(path.resolve("/home/peter"), ".hello-io-dev");
    expect(env.HELLO_IO_PROFILE).toBe("dev");
    expect(env.HELLO_IO_STATE_DIR).toBe(expectedStateDir);
    expect(env.HELLO_IO_CONFIG_PATH).toBe(path.join(expectedStateDir, "hello-io.json"));
    expect(env.HELLO_IO_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      HELLO_IO_STATE_DIR: "/custom",
      HELLO_IO_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.HELLO_IO_STATE_DIR).toBe("/custom");
    expect(env.HELLO_IO_GATEWAY_PORT).toBe("19099");
    expect(env.HELLO_IO_CONFIG_PATH).toBe(path.join("/custom", "hello-io.json"));
  });

  it("uses HELLO_IO_HOME when deriving profile state dir", () => {
    const env: Record<string, string | undefined> = {
      HELLO_IO_HOME: "/srv/hello-io-home",
      HOME: "/home/other",
    };
    applyCliProfileEnv({
      profile: "work",
      env,
      homedir: () => "/home/fallback",
    });

    const resolvedHome = path.resolve("/srv/hello-io-home");
    expect(env.HELLO_IO_STATE_DIR).toBe(path.join(resolvedHome, ".hello-io-work"));
    expect(env.HELLO_IO_CONFIG_PATH).toBe(
      path.join(resolvedHome, ".hello-io-work", "hello-io.json"),
    );
  });
});

describe("formatCliCommand", () => {
  it.each([
    {
      name: "no profile is set",
      cmd: "hello-io doctor --fix",
      env: {},
      expected: "hello-io doctor --fix",
    },
    {
      name: "profile is default",
      cmd: "hello-io doctor --fix",
      env: { HELLO_IO_PROFILE: "default" },
      expected: "hello-io doctor --fix",
    },
    {
      name: "profile is Default (case-insensitive)",
      cmd: "hello-io doctor --fix",
      env: { HELLO_IO_PROFILE: "Default" },
      expected: "hello-io doctor --fix",
    },
    {
      name: "profile is invalid",
      cmd: "hello-io doctor --fix",
      env: { HELLO_IO_PROFILE: "bad profile" },
      expected: "hello-io doctor --fix",
    },
    {
      name: "--profile is already present",
      cmd: "hello-io --profile work doctor --fix",
      env: { HELLO_IO_PROFILE: "work" },
      expected: "hello-io --profile work doctor --fix",
    },
    {
      name: "--dev is already present",
      cmd: "hello-io --dev doctor",
      env: { HELLO_IO_PROFILE: "dev" },
      expected: "hello-io --dev doctor",
    },
  ])("returns command unchanged when $name", ({ cmd, env, expected }) => {
    expect(formatCliCommand(cmd, env)).toBe(expected);
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("hello-io doctor --fix", { HELLO_IO_PROFILE: "work" })).toBe(
      "hello-io --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(formatCliCommand("hello-io doctor --fix", { HELLO_IO_PROFILE: "  jbhello-io  " })).toBe(
      "hello-io --profile jbhello-io doctor --fix",
    );
  });

  it("handles command with no args after hello-io", () => {
    expect(formatCliCommand("hello-io", { HELLO_IO_PROFILE: "test" })).toBe(
      "hello-io --profile test",
    );
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm hello-io doctor", { HELLO_IO_PROFILE: "work" })).toBe(
      "pnpm hello-io --profile work doctor",
    );
  });
});
