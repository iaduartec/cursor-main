import { execSync } from "child_process";
import { existsSync } from "fs";

function getStagedFiles() {
  try {
    const output = execSync("git diff --cached --name-only --diff-filter=ACMRTUXB", { 
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"]
    });
    
    return output
      .split("\n")
      .filter(file => file.trim() !== "")
      .filter(file => /\.(js|jsx|ts|tsx)$/.test(file))
      .filter(file => existsSync(file));
  } catch (error) {
    console.log("ℹ️  No staged files detected");
    return [];
  }
}

function runLintOnFiles(files) {
  if (files.length === 0) {
    console.log("✅ No staged JS/TS files to check");
    return;
  }

  console.log(`🔍 Checking ${files.length} staged files:`);
  files.forEach(file => console.log(`   - ${file}`));

  try {
    const fileList = files.map(f => `"${f}"`).join(" ");
    execSync(`pnpm eslint ${fileList} --max-warnings=0`, { 
      stdio: "inherit",
      encoding: "utf8"
    });
    console.log("✅ All staged files pass ESLint");
  } catch (error) {
    console.error("❌ Errors found in staged files");
    process.exit(1);
  }
}

const stagedFiles = getStagedFiles();
runLintOnFiles(stagedFiles);
