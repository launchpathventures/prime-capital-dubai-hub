description: Prepare a release (changelog, version bump, commit, ready to push)
description: Catalyst: Prepare release

Run a structured release workflow so the repo is ready to push.

@catalyst/prompts/repo-release.md

## Guardrails

- Do not push or tag without explicit confirmation
- Do not change unrelated files
- If bump would be **major**, confirm with user before proceeding
- Prefer a single, clean release commit
