# Git Pull Guide

This guide explains how to use the git pull functionality implemented in this repository.

## Overview

The repository now includes a smart git pull script that safely handles pulling changes from remote repositories with proper error handling, conflict detection, and post-pull hooks.

## Usage

### Basic Git Pull

```bash
npm run git:pull
```

This command will:

1. Check if you're in a git repository
2. Verify working directory status
3. Warn about uncommitted changes
4. Fetch latest changes from origin
5. Pull changes to current branch
6. Run post-pull hooks

### Dry Run Mode

To see what would happen without actually pulling:

```bash
npm run git:pull:dry-run
```

### Direct Script Usage

You can also run the script directly:

```bash
node scripts/git-pull.js
node scripts/git-pull.js --dry-run
node scripts/git-pull.js --help
```

## Features

### 🔍 Pre-Pull Checks

- **Repository Validation**: Ensures you're in a git repository
- **Status Check**: Shows uncommitted changes and warns before pulling
- **Branch Detection**: Identifies current branch automatically

### 📥 Smart Pulling

- **Fetch First**: Always fetches latest changes before pulling
- **Behind Detection**: Shows how many commits you're behind
- **Safe Pulling**: Only pulls if repository is in a safe state

### 🔧 Post-Pull Hooks

The script automatically checks for important file changes and provides recommendations:

- **package.json Changes**: Suggests running `pnpm install` if dependencies changed
- **Contentlayer Config**: Alerts if content configuration was modified
- **Build Requirements**: Notifies about potential rebuild needs

### ⚠️ Conflict Handling

If merge conflicts occur, the script provides clear guidance:

1. Review conflicted files: `git status`
2. Edit files to resolve conflicts
3. Add resolved files: `git add <file>`
4. Complete merge: `git commit`

## Examples

### Successful Pull

```bash
$ npm run git:pull

> duartec-web@1.0.0 git:pull
> node scripts/git-pull.js

🔄 Checking git status...
📍 Current branch: main
📥 Fetching latest changes...
📊 3 commits behind origin/main
⬇️  Pulling changes...
✅ Git pull completed successfully

🔧 Running post-pull checks...
📦 package.json was updated, you may want to run: pnpm install
✅ Post-pull checks completed
```

### With Uncommitted Changes

```bash
$ npm run git:pull

> duartec-web@1.0.0 git:pull
> node scripts/git-pull.js

🔄 Checking git status...
⚠️  Warning: Working directory has uncommitted changes
Status:
 M src/components/Header.tsx
?? temp-file.txt

Consider committing or stashing changes before pulling.
📍 Current branch: feature/new-component
📥 Fetching latest changes...
✅ Already up to date
```

### Merge Conflict

```bash
$ npm run git:pull

❌ Git pull failed: CONFLICT (content): Merge conflict in src/config.ts

🔧 Merge conflict detected. To resolve:
   1. Review conflicted files: git status
   2. Edit files to resolve conflicts
   3. Add resolved files: git add <file>
   4. Complete merge: git commit
```

## Integration with Development Workflow

### Pre-commit Hook Integration

The repository includes husky pre-commit hooks that run:

- TypeScript type checking
- Linting
- Tests (if available)

After pulling changes, these hooks ensure code quality is maintained.

### Build Process Integration

After pulling changes that affect:

- `package.json` - Run `pnpm install`
- `contentlayer.config.ts` - Consider rebuilding content
- Build configs - Run `npm run build`

## Troubleshooting

### Authentication Issues

If you encounter authentication errors:

```bash
remote: Invalid username or token
fatal: Authentication failed
```

This is expected in sandboxed environments. In normal development:

1. Ensure GitHub credentials are properly configured
2. Use SSH keys or personal access tokens
3. Check repository permissions

### Network Issues

If fetch operations fail due to network restrictions:

1. Check internet connectivity
2. Verify firewall settings
3. Try again after network issues resolve

### Repository State Issues

If the repository is in an unexpected state:

```bash
# Check current status
git status

# See recent commits
git log --oneline -5

# Check remote configuration
git remote -v
```

## Advanced Usage

### Custom Branch Pulling

The script automatically detects your current branch, but you can also:

```bash
# Switch to specific branch first
git checkout main
npm run git:pull

# Or pull specific branch
git pull origin main
```

### Handling Submodules

If your repository has submodules:

```bash
# After pulling, update submodules
git submodule update --recursive
```

## Best Practices

1. **Always check status first**: Use `git status` before pulling
2. **Commit changes**: Don't pull with uncommitted changes
3. **Stay up to date**: Pull regularly to avoid large merges
4. **Review changes**: Check what changed after pulling
5. **Test after pulling**: Run tests to ensure nothing broke

## Configuration

The git pull script can be customized by modifying `scripts/git-pull.js`:

- Add custom post-pull hooks
- Modify conflict resolution guidance
- Add branch-specific logic
- Integrate with deployment scripts

This ensures the git pull functionality meets your specific workflow requirements.
