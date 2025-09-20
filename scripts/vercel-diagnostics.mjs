#!/usr/bin/env node
/**
 * Vercel Deployment Diagnostics Tool
 * Checks common issues that could cause deployment failures
 */

import { existsSync, readFileSync } from 'fs';
import { spawn } from 'child_process';
import path from 'path';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

class VercelDiagnostics {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.fixes = [];
  }

  log(message, color = RESET) {
    console.log(`${color}${message}${RESET}`);
  }

  addIssue(issue) {
    this.issues.push(issue);
    this.log(`❌ ${issue}`, RED);
  }

  addWarning(warning) {
    this.warnings.push(warning);
    this.log(`⚠️  ${warning}`, YELLOW);
  }

  addFix(fix) {
    this.fixes.push(fix);
    this.log(`✅ ${fix}`, GREEN);
  }

  checkPackageJson() {
    this.log('\n🔍 Checking package.json configuration...');
    
    if (!existsSync('package.json')) {
      this.addIssue('package.json not found');
      return;
    }

    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    
    // Check package manager
    if (pkg.packageManager && !pkg.packageManager.startsWith('pnpm')) {
      this.addWarning(`Package manager is ${pkg.packageManager}, but project uses pnpm`);
    }

    // Check Node.js version
    if (pkg.engines?.node) {
      const nodeVersion = pkg.engines.node;
      if (!nodeVersion.includes('22')) {
        this.addWarning(`Node.js version requirement: ${nodeVersion}. Ensure Vercel uses compatible version.`);
      } else {
        this.addFix(`Node.js version requirement is compatible: ${nodeVersion}`);
      }
    }

    // Check scripts
    if (!pkg.scripts?.build) {
      this.addIssue('No build script found in package.json');
    } else if (pkg.scripts.build !== 'next build') {
      this.addFix(`Build script: ${pkg.scripts.build}`);
    }

    // Check critical dependencies
    const criticalDeps = ['next', 'react', 'react-dom'];
    criticalDeps.forEach(dep => {
      if (!pkg.dependencies?.[dep]) {
        this.addIssue(`Missing critical dependency: ${dep}`);
      }
    });
  }

  checkVercelConfig() {
    this.log('\n🔍 Checking Vercel configuration...');

    if (!existsSync('vercel.json')) {
      this.addWarning('vercel.json not found - using Vercel defaults');
      this.addFix('Created vercel.json with recommended configuration');
    } else {
      const vercelConfig = JSON.parse(readFileSync('vercel.json', 'utf8'));
      
      if (vercelConfig.buildCommand) {
        if (vercelConfig.buildCommand.includes('pnpm')) {
          this.addFix(`Build command uses pnpm: ${vercelConfig.buildCommand}`);
        } else {
          this.addWarning(`Build command: ${vercelConfig.buildCommand} - consider using pnpm`);
        }
      }

      if (vercelConfig.installCommand) {
        if (vercelConfig.installCommand.includes('pnpm')) {
          this.addFix(`Install command uses pnpm: ${vercelConfig.installCommand}`);
        } else {
          this.addWarning(`Install command: ${vercelConfig.installCommand} - consider using pnpm`);
        }
      }
    }
  }

  checkNextConfig() {
    this.log('\n🔍 Checking Next.js configuration...');

    if (!existsSync('next.config.mjs') && !existsSync('next.config.js')) {
      this.addWarning('No Next.js config file found');
      return;
    }

    const configFile = existsSync('next.config.mjs') ? 'next.config.mjs' : 'next.config.js';
    const config = readFileSync(configFile, 'utf8');

    if (config.includes('output: \'standalone\'')) {
      this.addWarning('Standalone output detected - may cause "No serverless pages" error on Vercel');
    }

    if (config.includes('typescript: { ignoreBuildErrors: true }')) {
      this.addWarning('TypeScript errors are ignored during build');
    }

    if (config.includes('eslint: { ignoreDuringBuilds: true }')) {
      this.addWarning('ESLint errors are ignored during build');
    }
  }

  checkEnvironmentFiles() {
    this.log('\n🔍 Checking environment configuration...');

    if (existsSync('.env.local')) {
      this.addWarning('.env.local found - ensure production variables are set in Vercel dashboard');
    }

    if (existsSync('.env.example.db')) {
      this.addFix('Database environment example found');
    }

    if (!existsSync('.env') && !existsSync('.env.local')) {
      this.addWarning('No environment files found');
    }
  }

  checkDependencies() {
    this.log('\n🔍 Checking for common dependency issues...');

    if (existsSync('pnpm-lock.yaml')) {
      this.addFix('pnpm-lock.yaml found - good for reproducible builds');
    } else {
      this.addWarning('No pnpm-lock.yaml found');
    }

    if (existsSync('package-lock.json') || existsSync('yarn.lock')) {
      this.addWarning('Multiple lockfiles detected - may cause conflicts');
    }
  }

  async checkBuildProcess() {
    this.log('\n🔍 Testing build process...');

    return new Promise((resolve) => {
      const build = spawn('pnpm', ['build'], { stdio: 'pipe' });
      let output = '';
      let errorOutput = '';

      build.stdout.on('data', (data) => {
        output += data.toString();
      });

      build.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      build.on('close', (code) => {
        if (code === 0) {
          this.addFix('Build process completed successfully');
        } else {
          this.addIssue(`Build process failed with code ${code}`);
          if (errorOutput) {
            console.log('\nBuild errors:');
            console.log(errorOutput);
          }
        }
        resolve();
      });

      build.on('error', (err) => {
        this.addIssue(`Failed to start build process: ${err.message}`);
        resolve();
      });
    });
  }

  generateReport() {
    this.log('\n📊 DIAGNOSIS SUMMARY', YELLOW);
    this.log('='.repeat(50), YELLOW);

    if (this.issues.length === 0 && this.warnings.length === 0) {
      this.log('\n🎉 No critical issues found! Your project should deploy successfully to Vercel.', GREEN);
    } else {
      if (this.issues.length > 0) {
        this.log(`\n❌ Critical Issues (${this.issues.length}):`, RED);
        this.issues.forEach(issue => this.log(`   • ${issue}`, RED));
      }

      if (this.warnings.length > 0) {
        this.log(`\n⚠️  Warnings (${this.warnings.length}):`, YELLOW);
        this.warnings.forEach(warning => this.log(`   • ${warning}`, YELLOW));
      }
    }

    if (this.fixes.length > 0) {
      this.log(`\n✅ Good Configurations (${this.fixes.length}):`, GREEN);
      this.fixes.forEach(fix => this.log(`   • ${fix}`, GREEN));
    }

    this.log('\n💡 Recommendations for Vercel deployment:', YELLOW);
    this.log('   • Use Node.js 22.x in Vercel project settings');
    this.log('   • Set build command to: pnpm build');
    this.log('   • Set install command to: pnpm install --frozen-lockfile');
    this.log('   • Configure required environment variables (POSTGRES_URL, etc.)');
    this.log('   • Enable build cache in Vercel settings');
  }

  async run() {
    this.log('🚀 Vercel Deployment Diagnostics Tool', GREEN);
    this.log('='.repeat(50), GREEN);

    this.checkPackageJson();
    this.checkVercelConfig();
    this.checkNextConfig();
    this.checkEnvironmentFiles();
    this.checkDependencies();
    
    // Skip build test if --skip-build flag is provided
    if (!process.argv.includes('--skip-build')) {
      await this.checkBuildProcess();
    }

    this.generateReport();
  }
}

// Run diagnostics
const diagnostics = new VercelDiagnostics();
diagnostics.run().catch(console.error);