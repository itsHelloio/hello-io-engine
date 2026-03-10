import { describe, expect, it } from "vitest";
import { resolveIrcInboundTarget } from "./monitor.js";

describe("irc monitor inbound target", () => {
  it("keeps channel target for group messages", () => {
    expect(
      resolveIrcInboundTarget({
        target: "#hello-io",
        senderNick: "alice",
      }),
    ).toEqual({
      isGroup: true,
      target: "#hello-io",
      rawTarget: "#hello-io",
    });
  });

  it("maps DM target to sender nick and preserves raw target", () => {
    expect(
      resolveIrcInboundTarget({
        target: "hello-io-bot",
        senderNick: "alice",
      }),
    ).toEqual({
      isGroup: false,
      target: "alice",
      rawTarget: "hello-io-bot",
    });
  });

  it("falls back to raw target when sender nick is empty", () => {
    expect(
      resolveIrcInboundTarget({
        target: "hello-io-bot",
        senderNick: " ",
      }),
    ).toEqual({
      isGroup: false,
      target: "hello-io-bot",
      rawTarget: "hello-io-bot",
    });
  });
});
