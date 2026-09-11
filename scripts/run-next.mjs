import { spawn } from "node:child_process";
const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", ...process.argv.slice(2)],
  {
    stdio: "inherit",
    env: { ...process.env, RM_NATIVE_NEXT: "1", NEXT_TELEMETRY_DISABLED: "1" },
  },
);
child.on("exit", (code) => process.exit(code ?? 1));
