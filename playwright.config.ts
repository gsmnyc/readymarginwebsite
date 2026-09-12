import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  workers: 1,
  use: {
    baseURL: process.env.BROWSER_BASE_URL || "http://127.0.0.1:3000",
    reducedMotion: "reduce",
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    },
  },
  projects: [
    { name: "phone", use: { viewport: { width: 390, height: 844 }, hasTouch: true } },
    { name: "phone-desktop-site", use: { viewport: { width: 980, height: 900 }, hasTouch: true, isMobile: true } },
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "4k", use: { viewport: { width: 3840, height: 2160 } } },
  ],
  webServer: process.env.BROWSER_BASE_URL ? undefined : {
    command: "npm start -- --hostname 127.0.0.1",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false,
  },
});
