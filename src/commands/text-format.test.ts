import { describe, expect, it } from "vitest";
import { shortenText } from "./text-format.js";

describe("shortenText", () => {
  it("returns original text when it fits", () => {
    expect(shortenText("hello-io", 16)).toBe("hello-io");
  });

  it("truncates and appends ellipsis when over limit", () => {
    expect(shortenText("hello-io-status-output", 10)).toBe("hello-io-…");
  });

  it("counts multi-byte characters correctly", () => {
    expect(shortenText("hello🙂world", 7)).toBe("hello🙂…");
  });
});
