import { describe, expect, it } from "vitest";
import {
  buildParseArgv,
  getFlagValue,
  getCommandPath,
  getCommandPositionalsWithRootOptions,
  getCommandPathWithRootOptions,
  getPrimaryCommand,
  getPositiveIntFlagValue,
  getVerboseFlag,
  hasHelpOrVersion,
  hasFlag,
  isRootHelpInvocation,
  isRootVersionInvocation,
  shouldMigrateState,
  shouldMigrateStateFromPath,
} from "./argv.js";

describe("argv helpers", () => {
  it.each([
    {
      name: "help flag",
      argv: ["node", "hello-io", "--help"],
      expected: true,
    },
    {
      name: "version flag",
      argv: ["node", "hello-io", "-V"],
      expected: true,
    },
    {
      name: "normal command",
      argv: ["node", "hello-io", "status"],
      expected: false,
    },
    {
      name: "root -v alias",
      argv: ["node", "hello-io", "-v"],
      expected: true,
    },
    {
      name: "root -v alias with profile",
      argv: ["node", "hello-io", "--profile", "work", "-v"],
      expected: true,
    },
    {
      name: "root -v alias with log-level",
      argv: ["node", "hello-io", "--log-level", "debug", "-v"],
      expected: true,
    },
    {
      name: "subcommand -v should not be treated as version",
      argv: ["node", "hello-io", "acp", "-v"],
      expected: false,
    },
    {
      name: "root -v alias with equals profile",
      argv: ["node", "hello-io", "--profile=work", "-v"],
      expected: true,
    },
    {
      name: "subcommand path after global root flags should not be treated as version",
      argv: ["node", "hello-io", "--dev", "skills", "list", "-v"],
      expected: false,
    },
  ])("detects help/version flags: $name", ({ argv, expected }) => {
    expect(hasHelpOrVersion(argv)).toBe(expected);
  });

  it.each([
    {
      name: "root --version",
      argv: ["node", "hello-io", "--version"],
      expected: true,
    },
    {
      name: "root -V",
      argv: ["node", "hello-io", "-V"],
      expected: true,
    },
    {
      name: "root -v alias with profile",
      argv: ["node", "hello-io", "--profile", "work", "-v"],
      expected: true,
    },
    {
      name: "subcommand version flag",
      argv: ["node", "hello-io", "status", "--version"],
      expected: false,
    },
    {
      name: "unknown root flag with version",
      argv: ["node", "hello-io", "--unknown", "--version"],
      expected: false,
    },
  ])("detects root-only version invocations: $name", ({ argv, expected }) => {
    expect(isRootVersionInvocation(argv)).toBe(expected);
  });

  it.each([
    {
      name: "root --help",
      argv: ["node", "hello-io", "--help"],
      expected: true,
    },
    {
      name: "root -h",
      argv: ["node", "hello-io", "-h"],
      expected: true,
    },
    {
      name: "root --help with profile",
      argv: ["node", "hello-io", "--profile", "work", "--help"],
      expected: true,
    },
    {
      name: "subcommand --help",
      argv: ["node", "hello-io", "status", "--help"],
      expected: false,
    },
    {
      name: "help before subcommand token",
      argv: ["node", "hello-io", "--help", "status"],
      expected: false,
    },
    {
      name: "help after -- terminator",
      argv: ["node", "hello-io", "nodes", "run", "--", "git", "--help"],
      expected: false,
    },
    {
      name: "unknown root flag before help",
      argv: ["node", "hello-io", "--unknown", "--help"],
      expected: false,
    },
    {
      name: "unknown root flag after help",
      argv: ["node", "hello-io", "--help", "--unknown"],
      expected: false,
    },
  ])("detects root-only help invocations: $name", ({ argv, expected }) => {
    expect(isRootHelpInvocation(argv)).toBe(expected);
  });

  it.each([
    {
      name: "single command with trailing flag",
      argv: ["node", "hello-io", "status", "--json"],
      expected: ["status"],
    },
    {
      name: "two-part command",
      argv: ["node", "hello-io", "agents", "list"],
      expected: ["agents", "list"],
    },
    {
      name: "terminator cuts parsing",
      argv: ["node", "hello-io", "status", "--", "ignored"],
      expected: ["status"],
    },
  ])("extracts command path: $name", ({ argv, expected }) => {
    expect(getCommandPath(argv, 2)).toEqual(expected);
  });

  it("extracts command path while skipping known root option values", () => {
    expect(
      getCommandPathWithRootOptions(
        ["node", "hello-io", "--profile", "work", "--no-color", "config", "validate"],
        2,
      ),
    ).toEqual(["config", "validate"]);
  });

  it("extracts routed config get positionals with interleaved root options", () => {
    expect(
      getCommandPositionalsWithRootOptions(
        ["node", "hello-io", "config", "get", "--log-level", "debug", "update.channel", "--json"],
        {
          commandPath: ["config", "get"],
          booleanFlags: ["--json"],
        },
      ),
    ).toEqual(["update.channel"]);
  });

  it("extracts routed config unset positionals with interleaved root options", () => {
    expect(
      getCommandPositionalsWithRootOptions(
        ["node", "hello-io", "config", "unset", "--profile", "work", "update.channel"],
        {
          commandPath: ["config", "unset"],
        },
      ),
    ).toEqual(["update.channel"]);
  });

  it("returns null when routed command sees unknown options", () => {
    expect(
      getCommandPositionalsWithRootOptions(
        ["node", "hello-io", "config", "get", "--mystery", "value", "update.channel"],
        {
          commandPath: ["config", "get"],
          booleanFlags: ["--json"],
        },
      ),
    ).toBeNull();
  });

  it.each([
    {
      name: "returns first command token",
      argv: ["node", "hello-io", "agents", "list"],
      expected: "agents",
    },
    {
      name: "returns null when no command exists",
      argv: ["node", "hello-io"],
      expected: null,
    },
    {
      name: "skips known root option values",
      argv: ["node", "hello-io", "--log-level", "debug", "status"],
      expected: "status",
    },
  ])("returns primary command: $name", ({ argv, expected }) => {
    expect(getPrimaryCommand(argv)).toBe(expected);
  });

  it.each([
    {
      name: "detects flag before terminator",
      argv: ["node", "hello-io", "status", "--json"],
      flag: "--json",
      expected: true,
    },
    {
      name: "ignores flag after terminator",
      argv: ["node", "hello-io", "--", "--json"],
      flag: "--json",
      expected: false,
    },
  ])("parses boolean flags: $name", ({ argv, flag, expected }) => {
    expect(hasFlag(argv, flag)).toBe(expected);
  });

  it.each([
    {
      name: "value in next token",
      argv: ["node", "hello-io", "status", "--timeout", "5000"],
      expected: "5000",
    },
    {
      name: "value in equals form",
      argv: ["node", "hello-io", "status", "--timeout=2500"],
      expected: "2500",
    },
    {
      name: "missing value",
      argv: ["node", "hello-io", "status", "--timeout"],
      expected: null,
    },
    {
      name: "next token is another flag",
      argv: ["node", "hello-io", "status", "--timeout", "--json"],
      expected: null,
    },
    {
      name: "flag appears after terminator",
      argv: ["node", "hello-io", "--", "--timeout=99"],
      expected: undefined,
    },
  ])("extracts flag values: $name", ({ argv, expected }) => {
    expect(getFlagValue(argv, "--timeout")).toBe(expected);
  });

  it("parses verbose flags", () => {
    expect(getVerboseFlag(["node", "hello-io", "status", "--verbose"])).toBe(true);
    expect(getVerboseFlag(["node", "hello-io", "status", "--debug"])).toBe(false);
    expect(getVerboseFlag(["node", "hello-io", "status", "--debug"], { includeDebug: true })).toBe(
      true,
    );
  });

  it.each([
    {
      name: "missing flag",
      argv: ["node", "hello-io", "status"],
      expected: undefined,
    },
    {
      name: "missing value",
      argv: ["node", "hello-io", "status", "--timeout"],
      expected: null,
    },
    {
      name: "valid positive integer",
      argv: ["node", "hello-io", "status", "--timeout", "5000"],
      expected: 5000,
    },
    {
      name: "invalid integer",
      argv: ["node", "hello-io", "status", "--timeout", "nope"],
      expected: undefined,
    },
  ])("parses positive integer flag values: $name", ({ argv, expected }) => {
    expect(getPositiveIntFlagValue(argv, "--timeout")).toBe(expected);
  });

  it("builds parse argv from raw args", () => {
    const cases = [
      {
        rawArgs: ["node", "hello-io", "status"],
        expected: ["node", "hello-io", "status"],
      },
      {
        rawArgs: ["node-22", "hello-io", "status"],
        expected: ["node-22", "hello-io", "status"],
      },
      {
        rawArgs: ["node-22.2.0.exe", "hello-io", "status"],
        expected: ["node-22.2.0.exe", "hello-io", "status"],
      },
      {
        rawArgs: ["node-22.2", "hello-io", "status"],
        expected: ["node-22.2", "hello-io", "status"],
      },
      {
        rawArgs: ["node-22.2.exe", "hello-io", "status"],
        expected: ["node-22.2.exe", "hello-io", "status"],
      },
      {
        rawArgs: ["/usr/bin/node-22.2.0", "hello-io", "status"],
        expected: ["/usr/bin/node-22.2.0", "hello-io", "status"],
      },
      {
        rawArgs: ["node24", "hello-io", "status"],
        expected: ["node24", "hello-io", "status"],
      },
      {
        rawArgs: ["/usr/bin/node24", "hello-io", "status"],
        expected: ["/usr/bin/node24", "hello-io", "status"],
      },
      {
        rawArgs: ["node24.exe", "hello-io", "status"],
        expected: ["node24.exe", "hello-io", "status"],
      },
      {
        rawArgs: ["nodejs", "hello-io", "status"],
        expected: ["nodejs", "hello-io", "status"],
      },
      {
        rawArgs: ["node-dev", "hello-io", "status"],
        expected: ["node", "hello-io", "node-dev", "hello-io", "status"],
      },
      {
        rawArgs: ["hello-io", "status"],
        expected: ["node", "hello-io", "status"],
      },
      {
        rawArgs: ["bun", "src/entry.ts", "status"],
        expected: ["bun", "src/entry.ts", "status"],
      },
    ] as const;

    for (const testCase of cases) {
      const parsed = buildParseArgv({
        programName: "hello-io",
        rawArgs: [...testCase.rawArgs],
      });
      expect(parsed).toEqual([...testCase.expected]);
    }
  });

  it("builds parse argv from fallback args", () => {
    const fallbackArgv = buildParseArgv({
      programName: "hello-io",
      fallbackArgv: ["status"],
    });
    expect(fallbackArgv).toEqual(["node", "hello-io", "status"]);
  });

  it("decides when to migrate state", () => {
    const nonMutatingArgv = [
      ["node", "hello-io", "status"],
      ["node", "hello-io", "health"],
      ["node", "hello-io", "sessions"],
      ["node", "hello-io", "config", "get", "update"],
      ["node", "hello-io", "config", "unset", "update"],
      ["node", "hello-io", "models", "list"],
      ["node", "hello-io", "models", "status"],
      ["node", "hello-io", "memory", "status"],
      ["node", "hello-io", "agent", "--message", "hi"],
    ] as const;
    const mutatingArgv = [
      ["node", "hello-io", "agents", "list"],
      ["node", "hello-io", "message", "send"],
    ] as const;

    for (const argv of nonMutatingArgv) {
      expect(shouldMigrateState([...argv])).toBe(false);
    }
    for (const argv of mutatingArgv) {
      expect(shouldMigrateState([...argv])).toBe(true);
    }
  });

  it.each([
    { path: ["status"], expected: false },
    { path: ["config", "get"], expected: false },
    { path: ["models", "status"], expected: false },
    { path: ["agents", "list"], expected: true },
  ])("reuses command path for migrate state decisions: $path", ({ path, expected }) => {
    expect(shouldMigrateStateFromPath(path)).toBe(expected);
  });
});
