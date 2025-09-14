import { execSync } from "child_process";
import { writeFileSync } from "fs";

function getOutdatedDependencies() {
  try {
    const output = execSync("pnpm outdated --format json", { 
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"]
    });
    
    return JSON.parse(output);
  } catch (error) {
    // pnpm outdated returns exit code 1 when there are outdated packages
    if (error.stdout) {
      try {
        return JSON.parse(error.stdout);
      } catch (parseError) {
        console.error("❌ Error parsing pnpm outdated output");
        return {};
      }
    }
    console.log("ℹ️  No outdated dependencies found or pnpm error");
    return {};
  }
}

function categorizeUpdates(outdated) {
  const categories = {
    major: [],
    minor: [],
    patch: [],
    unknown: []
  };

  for (const [name, info] of Object.entries(outdated)) {
    const current = info.current || "unknown";
    const wanted = info.wanted || "unknown"; 
    const latest = info.latest || "unknown";
    
    // Determine update type based on version differences
    let updateType = "unknown";
    if (current !== "unknown" && latest !== "unknown") {
      const currentParts = current.replace(/[^\\d.]/g, "").split(".");
      const latestParts = latest.replace(/[^\\d.]/g, "").split(".");
      
      if (currentParts[0] !== latestParts[0]) {
        updateType = "major";
      } else if (currentParts[1] !== latestParts[1]) {
        updateType = "minor";
      } else {
        updateType = "patch";
      }
    }
    
    categories[updateType].push({
      name,
      current,
      wanted,
      latest,
      type: info.dependencyType || "unknown"
    });
  }

  return categories;
}

function generateReport(categories) {
  const timestamp = new Date().toISOString();
  const totalOutdated = Object.values(categories).flat().length;
  
  let report = `# Dependency Update Report\\n`;
  report += `Generated: ${timestamp}\\n\\n`;
  report += `## Summary\\n`;
  report += `- Total outdated dependencies: ${totalOutdated}\\n`;
  report += `- Major updates: ${categories.major.length} (⚠️  Breaking changes possible)\\n`;
  report += `- Minor updates: ${categories.minor.length} (✨ New features)\\n`;
  report += `- Patch updates: ${categories.patch.length} (🐛 Bug fixes)\\n\\n`;

  ["patch", "minor", "major"].forEach(type => {
    if (categories[type].length > 0) {
      const emoji = type === "major" ? "⚠️" : type === "minor" ? "✨" : "🐛";
      report += `## ${emoji} ${type.toUpperCase()} Updates\\n\\n`;
      
      categories[type].forEach(dep => {
        report += `- **${dep.name}** (${dep.type})\\n`;
        report += `  - Current: ${dep.current}\\n`;
        report += `  - Latest: ${dep.latest}\\n\\n`;
      });
    }
  });

  return report;
}

function saveReport(report) {
  const filename = `dependency-report-${new Date().toISOString().split("T")[0]}.md`;
  writeFileSync(filename, report);
  console.log(`📊 Report saved to: ${filename}`);
}

// Main execution
console.log("🔍 Checking for outdated dependencies...");
const outdated = getOutdatedDependencies();
const categories = categorizeUpdates(outdated);
const report = generateReport(categories);

console.log(report);
saveReport(report);

// Summary output
const total = Object.values(categories).flat().length;
if (total === 0) {
  console.log("✅ All dependencies are up to date!");
} else {
  console.log(`📦 Found ${total} outdated dependencies`);
  console.log(`⚠️  Major: ${categories.major.length} | ✨ Minor: ${categories.minor.length} | 🐛 Patch: ${categories.patch.length}`);
}
