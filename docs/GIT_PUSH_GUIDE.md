# Git Push Guide

This guide explains how to safely publish your local changes to the remote repository using `git push`.

## Before pushing

1. **Check repository status**
   ```bash
   git status
   ```
   Make sure there are no unrelated changes and confirm which branch you are on.

2. **Run tests and linters**
   ```bash
   pnpm lint
   pnpm test
   ```
   Running automated checks locally prevents broken builds from reaching the remote.

3. **Pull the latest changes**
   ```bash
   npm run git:pull
   ```
   Keeping your branch up to date reduces the chance of rejected pushes due to diverging history.

## Standard push workflow

Push the current branch to its upstream remote with:

```bash
git push origin <branch>
```

Replace `<branch>` with the name of the branch you want to publish (for example `main` or `feature/login`). If the branch already has an upstream configured you can simply run `git push`.

### First push for a new branch

If the branch does not exist on the remote yet, set the upstream in the same command:

```bash
git push -u origin <branch>
```

Once the upstream is set you can use plain `git push` on subsequent updates.

## Handling rejected pushes

If the push is rejected because the remote has newer commits:

1. Pull the remote changes:
   ```bash
   npm run git:pull
   ```
2. Resolve any merge conflicts, commit, and try pushing again.

If your push is rejected due to protected branch rules or required status checks, review the CI output and fix the reported issues before retrying.

## Force pushing (use sparingly)

Force pushes rewrite history and should be avoided on shared branches. Only use them when you understand the implications.

```bash
git push --force-with-lease origin <branch>
```

The `--force-with-lease` flag is safer than `--force` because it refuses to overwrite commits you have not seen locally.

## Working with tags

To publish a new tag after pushing commits:

```bash
git tag v1.2.0
git push origin v1.2.0
```

Use `git push origin --tags` to push all local tags at once. Tags are immutable references, so double-check the commit you are tagging before pushing.

## Troubleshooting

- **Authentication failed**: Update your SSH keys or personal access token. In sandboxed environments, pushing to remote may be blocked.
- **Non-fast-forward**: Pull the latest changes, resolve conflicts, commit, and push again.
- **Detached HEAD**: Switch to a branch (`git checkout main` or `git switch <branch>`) before pushing.
- **Large files**: Use Git LFS or remove oversized files before pushing.

## Best practices

- Commit small, cohesive changes with clear messages.
- Pull frequently to minimize conflicts.
- Run tests before every push.
- Never force push to shared or protected branches unless coordinated with the team.
- After a successful push, monitor CI/CD pipelines for failures.
