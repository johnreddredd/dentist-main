/**
 * Production server — uses Railway's PORT (defaults to 3000 locally).
 */
import { spawn } from "node:child_process";

const port = process.env.PORT ?? "3000";

const child = spawn("npx", ["next", "start", "-H", "0.0.0.0", "-p", port], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 1));
