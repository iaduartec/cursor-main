#!/usr/bin/env node
// scripts/git-pull.js
// Helper script to handle git pull operations

const { execSync, spawn } = require('child_process');
const path = require('path');

/**
 * Execute git pull with proper error handling
 */
function gitPull() {
  try {
    console.log('🔄 Checking git status...');
    
    // Check if we're in a git repository
    try {
      execSync('git rev-parse --is-inside-work-tree', { 
        stdio: 'pipe',
        cwd: process.cwd() 
      });
    } catch (error) {
      console.error('❌ Error: Not in a git repository');
      process.exit(1);
    }

    // Check current status
    const status = execSync('git status --porcelain', { 
      encoding: 'utf8',
      cwd: process.cwd() 
    });

    if (status.trim()) {
      console.log('⚠️  Warning: Working directory has uncommitted changes');
      console.log('Status:');
      console.log(status);
      console.log('Consider committing or stashing changes before pulling.');
    }

    // Get current branch
    const currentBranch = execSync('git branch --show-current', { 
      encoding: 'utf8',
      cwd: process.cwd() 
    }).trim();

    console.log(`📍 Current branch: ${currentBranch}`);

    // Fetch latest changes
    console.log('📥 Fetching latest changes...');
    execSync('git fetch origin', { 
      stdio: 'inherit',
      cwd: process.cwd() 
    });

    // Check if there are updates available
    try {
      const behindBy = execSync(`git rev-list --count HEAD..origin/${currentBranch}`, { 
        encoding: 'utf8',
        cwd: process.cwd() 
      }).trim();

      if (behindBy === '0') {
        console.log('✅ Already up to date');
        return;
      }

      console.log(`📊 ${behindBy} commits behind origin/${currentBranch}`);
    } catch (error) {
      console.log('ℹ️  Could not determine behind status, proceeding with pull...');
    }

    // Perform the pull
    console.log('⬇️  Pulling changes...');
    execSync(`git pull origin ${currentBranch}`, { 
      stdio: 'inherit',
      cwd: process.cwd() 
    });

    console.log('✅ Git pull completed successfully');

    // Run post-pull hooks if they exist
    runPostPullHooks();

  } catch (error) {
    console.error('❌ Git pull failed:', error.message);
    
    if (error.message.includes('CONFLICT')) {
      console.log('');
      console.log('🔧 Merge conflict detected. To resolve:');
      console.log('   1. Review conflicted files: git status');
      console.log('   2. Edit files to resolve conflicts');
      console.log('   3. Add resolved files: git add <file>');
      console.log('   4. Complete merge: git commit');
    }
    
    process.exit(1);
  }
}

/**
 * Run post-pull hooks like dependency updates and rebuilds
 */
function runPostPullHooks() {
  console.log('');
  console.log('🔧 Running post-pull checks...');

  try {
    // Check if package.json was updated
    const packageJsonChanged = execSync('git diff HEAD~1 HEAD --name-only', { 
      encoding: 'utf8',
      cwd: process.cwd() 
    }).includes('package.json');

    if (packageJsonChanged) {
      console.log('📦 package.json was updated, you may want to run: pnpm install');
    }

    // Check if contentlayer config changed
    const contentlayerChanged = execSync('git diff HEAD~1 HEAD --name-only', { 
      encoding: 'utf8',
      cwd: process.cwd() 
    }).includes('contentlayer.config.ts');

    if (contentlayerChanged) {
      console.log('📝 Contentlayer config changed, you may want to rebuild');
    }

    console.log('✅ Post-pull checks completed');

  } catch (error) {
    console.log('⚠️  Could not run post-pull checks:', error.message);
  }
}

/**
 * Show help information
 */
function showHelp() {
  console.log(`
Git Pull Helper

Usage:
  node scripts/git-pull.js [options]

Options:
  --help, -h     Show this help message
  --dry-run      Show what would be done without executing
  --force        Force pull even with uncommitted changes

Examples:
  node scripts/git-pull.js           # Normal pull
  node scripts/git-pull.js --dry-run # Preview changes
  `);
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  if (args.includes('--dry-run')) {
    console.log('🔍 Dry run mode - showing what would be done:');
    console.log('  1. Check git status');
    console.log('  2. Fetch from origin');
    console.log('  3. Pull latest changes');
    console.log('  4. Run post-pull hooks');
    process.exit(0);
  }

  gitPull();
}

module.exports = { gitPull };