/**
 * Cross-platform Maven wrapper: backend/mvnw.cmd (Windows) vs backend/./mvnw (Unix).
 * Usage: node scripts/run-backend.cjs [maven args…]
 */
const { spawn } = require("child_process");
const path = require("path");

const backendDir = path.join(__dirname, "..", "backend");
const mavenArgs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["spring-boot:run"];

const isWin = process.platform === "win32";
const command = isWin ? path.join(backendDir, "mvnw.cmd") : "./mvnw";

const child = spawn(command, mavenArgs, {
  cwd: backendDir,
  stdio: "inherit",
  shell: isWin,
});

child.on("exit", (code) => {
  process.exit(code == null ? 1 : code);
});
