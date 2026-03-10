import os from "node:os";
import path from "node:path";
import type { PromptRequest } from "@agentclientprotocol/sdk";
import { describe, expect, it, vi } from "vitest";
import type { GatewayClient } from "../gateway/client.js";
import { createInMemorySessionStore } from "./session.js";
import { AcpGatewayAgent } from "./translator.js";
import { createAcpConnection, createAcpGateway } from "./translator.test-helpers.js";

describe("acp prompt cwd prefix", () => {
  async function runPromptWithCwd(cwd: string) {
    const pinnedHome = os.homedir();
    const previousHelloIoHome = process.env.HELLO_IO_HOME;
    const previousHome = process.env.HOME;
    delete process.env.HELLO_IO_HOME;
    process.env.HOME = pinnedHome;

    const sessionStore = createInMemorySessionStore();
    sessionStore.createSession({
      sessionId: "session-1",
      sessionKey: "agent:main:main",
      cwd,
    });

    const requestSpy = vi.fn(async (method: string) => {
      if (method === "chat.send") {
        throw new Error("stop-after-send");
      }
      return {};
    });
    const agent = new AcpGatewayAgent(
      createAcpConnection(),
      createAcpGateway(requestSpy as unknown as GatewayClient["request"]),
      {
        sessionStore,
        prefixCwd: true,
      },
    );

    try {
      await expect(
        agent.prompt({
          sessionId: "session-1",
          prompt: [{ type: "text", text: "hello" }],
          _meta: {},
        } as unknown as PromptRequest),
      ).rejects.toThrow("stop-after-send");
      return requestSpy;
    } finally {
      if (previousHelloIoHome === undefined) {
        delete process.env.HELLO_IO_HOME;
      } else {
        process.env.HELLO_IO_HOME = previousHelloIoHome;
      }
      if (previousHome === undefined) {
        delete process.env.HOME;
      } else {
        process.env.HOME = previousHome;
      }
    }
  }

  it("redacts home directory in prompt prefix", async () => {
    const requestSpy = await runPromptWithCwd(path.join(os.homedir(), "hello-io-test"));
    expect(requestSpy).toHaveBeenCalledWith(
      "chat.send",
      expect.objectContaining({
        message: expect.stringMatching(/\[Working directory: ~[\\/]hello-io-test\]/),
      }),
      { expectFinal: true },
    );
  });

  it("keeps backslash separators when cwd uses them", async () => {
    const requestSpy = await runPromptWithCwd(`${os.homedir()}\\hello-io-test`);
    expect(requestSpy).toHaveBeenCalledWith(
      "chat.send",
      expect.objectContaining({
        message: expect.stringContaining("[Working directory: ~\\hello-io-test]"),
      }),
      { expectFinal: true },
    );
  });

  it("injects system provenance metadata when enabled", async () => {
    const sessionStore = createInMemorySessionStore();
    sessionStore.createSession({
      sessionId: "session-1",
      sessionKey: "agent:main:main",
      cwd: path.join(os.homedir(), "hello-io-test"),
    });

    const requestSpy = vi.fn(async (method: string) => {
      if (method === "chat.send") {
        throw new Error("stop-after-send");
      }
      return {};
    });
    const agent = new AcpGatewayAgent(
      createAcpConnection(),
      createAcpGateway(requestSpy as unknown as GatewayClient["request"]),
      {
        sessionStore,
        provenanceMode: "meta",
      },
    );

    await expect(
      agent.prompt({
        sessionId: "session-1",
        prompt: [{ type: "text", text: "hello" }],
        _meta: {},
      } as unknown as PromptRequest),
    ).rejects.toThrow("stop-after-send");

    expect(requestSpy).toHaveBeenCalledWith(
      "chat.send",
      expect.objectContaining({
        systemInputProvenance: {
          kind: "external_user",
          originSessionId: "session-1",
          sourceChannel: "acp",
          sourceTool: "hello-io_acp",
        },
        systemProvenanceReceipt: undefined,
      }),
      { expectFinal: true },
    );
  });

  it("injects a system provenance receipt when requested", async () => {
    const sessionStore = createInMemorySessionStore();
    sessionStore.createSession({
      sessionId: "session-1",
      sessionKey: "agent:main:main",
      cwd: path.join(os.homedir(), "hello-io-test"),
    });

    const requestSpy = vi.fn(async (method: string) => {
      if (method === "chat.send") {
        throw new Error("stop-after-send");
      }
      return {};
    });
    const agent = new AcpGatewayAgent(
      createAcpConnection(),
      createAcpGateway(requestSpy as unknown as GatewayClient["request"]),
      {
        sessionStore,
        provenanceMode: "meta+receipt",
      },
    );

    await expect(
      agent.prompt({
        sessionId: "session-1",
        prompt: [{ type: "text", text: "hello" }],
        _meta: {},
      } as unknown as PromptRequest),
    ).rejects.toThrow("stop-after-send");

    expect(requestSpy).toHaveBeenCalledWith(
      "chat.send",
      expect.objectContaining({
        systemInputProvenance: {
          kind: "external_user",
          originSessionId: "session-1",
          sourceChannel: "acp",
          sourceTool: "hello-io_acp",
        },
        systemProvenanceReceipt: expect.stringContaining("[Source Receipt]"),
      }),
      { expectFinal: true },
    );
    expect(requestSpy).toHaveBeenCalledWith(
      "chat.send",
      expect.objectContaining({
        systemProvenanceReceipt: expect.stringContaining("bridge=hello-io-acp"),
      }),
      { expectFinal: true },
    );
    expect(requestSpy).toHaveBeenCalledWith(
      "chat.send",
      expect.objectContaining({
        systemProvenanceReceipt: expect.stringContaining("originSessionId=session-1"),
      }),
      { expectFinal: true },
    );
    expect(requestSpy).toHaveBeenCalledWith(
      "chat.send",
      expect.objectContaining({
        systemProvenanceReceipt: expect.stringContaining("targetSession=agent:main:main"),
      }),
      { expectFinal: true },
    );
  });
});
