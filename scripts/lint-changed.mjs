import { execSync } from "child_process";
import { existsSync } from "fs";

function getChangedFiles() {
  try {
    const output = execSync("git diff --name-only --diff-filter=ACMRTUXB HEAD", { 
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"]
    });
    
    return output
      .split("\n")
      .filter(file => file.trim() !== "")
      .filter(file => /\.(js|jsx|ts|tsx)$/.test(file))
      .filter(file => existsSync(file));
  } catch (error) {
    console.log("ℹ️  No changes detected");
    return [];
  }
}

function runLintOnFiles(files) {
  if (files.length === 0) {
    console.log("✅ No modified JS/TS files to check");
    return;
  }

  console.log(`🔍 Checking ${files.length} modified files:`);
  files.forEach(file => console.log(`   - ${file}`));

  try {
    const fileList = files.map(f => `"${f}"`).join(" ");
    execSync(`pnpm eslint ${fileList} --max-warnings=0`, { 
      stdio: "inherit",
      encoding: "utf8"
    });
    console.log("✅ All modified files pass ESLint");
  } catch (error) {
    console.error("❌ Errors found in modified files");
    process.exit(1);
  }
}

const changedFiles = getChangedFiles();
runLintOnFiles(changedFiles);
