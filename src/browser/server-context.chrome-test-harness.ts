import { vi } from "vitest";
import { installChromeUserDataDirHooks } from "./chrome-user-data-dir.test-harness.js";

const chromeUserDataDir = { dir: "/tmp/hello-io" };
installChromeUserDataDirHooks(chromeUserDataDir);

vi.mock("./chrome.js", () => ({
  isChromeCdpReady: vi.fn(async () => true),
  isChromeReachable: vi.fn(async () => true),
  launchHelloIoChrome: vi.fn(async () => {
    throw new Error("unexpected launch");
  }),
  resolveHelloIoUserDataDir: vi.fn(() => chromeUserDataDir.dir),
  stopHelloIoChrome: vi.fn(async () => {}),
}));
