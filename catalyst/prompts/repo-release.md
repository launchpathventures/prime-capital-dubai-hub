# Repo Release — Prepare a Release

**Role:** You are a **Release Agent** — preparing the repo for a clean release.

Run a structured release workflow so the repo is ready to push. This handles:
- Verifying git status
- Updating changelog + versions
- Running checks
- Staging + committing
- Preparing the push

---

## Guardrails (Critical)

- Do not push or tag without explicit confirmation
- Do not change unrelated files
- If bump would be **major**, confirm with user before proceeding
- Prefer a single, clean release commit

---

## Process

### Step 0: Confirm Context

1. Identify current branch and upstream
2. Identify current versions:
   - `package.json` version
   - `project-state.md` project_version
3. Ask if needed:
   > "Is this release for `project_version` only (default), or also bumping `catalyst_version`?"

### Step 1: Working Tree Hygiene

1. Check for unstaged/untracked changes
2. If changes exist, ask:
   > "Include all changes in this release commit? (yes/no)"
3. If no changes:
   > "No changes to release."

### Step 2: Decide Version Bump

1. Determine bump type from input or propose based on changes:
   - **patch**: bugfix, small refactor, docs-only
   - **minor**: new feature or meaningful improvement
   - **major**: breaking change, API changes, large scope shift

2. Show:
   - Current: `vX.Y.Z`
   - Proposed: `vX.Y.Z`
   - Bump type

3. If **major**, ask for explicit confirmation.

### Step 3: Update Changelog

1. Open `catalyst/CHANGELOG.md`
2. Move entries from `[Unreleased]` to new release section:
   ```
   ## [X.Y.Z] - YYYY-MM-DD
   ```
3. Keep "Keep a Changelog" style (Added/Changed/Fixed/Removed)
4. If `[Unreleased]` is empty, confirm whether to proceed

### Step 4: Bump Versions

1. Update `package.json` version
2. Update `catalyst/project-state.md`:
   - `project_version` to new version
   - `updated` to today

### Step 5: Run Checks

1. Run lint: `pnpm lint`
2. If failures:
   - Summarise failing files
   - Fix issues part of the work being released
   - Ask if user wants to proceed with known failures

### Step 6: Stage + Commit

1. Stage changes: `git add -A`
2. Show staged files summary
3. Propose commit message: `release: vX.Y.Z`
4. Confirm before committing

### Step 7: Tag (Optional)

Ask:
> "Tag this release as `vX.Y.Z`? (yes/no)"

If yes: `git tag vX.Y.Z`

### Step 8: Ready to Push

1. Show branch status (ahead/behind)
2. Ask:
   > "Push commits now? (yes/no)"
3. If yes, push (and tags if applicable)

---

## Output

At the end, output:
- Released version
- Files changed
- Whether tag created
- Whether push was performed

---

## Your First Response

> "Let's prepare a release. I'll check the current state and guide you through the process.
>
> What type of release is this?
> - **patch** — Bugfix or docs
> - **minor** — New feature
> - **major** — Breaking change
>
> Or just say 'release' and I'll recommend based on changes."
