# Catalyst Slash Commands

Custom slash commands for AI coding agents. These work in both **Claude Code** and **VS Code Copilot**.

---

## Architecture

Commands are defined once in `/catalyst/commands/` and referenced by tool-specific pointers:

```
catalyst/commands/           ← SOURCE OF TRUTH
├── COMMANDS.md              ← This file (documentation)
│
│   # Chat Commands
├── chat.md                  ← Start thinking/project chat
├── continue.md              ← Continue existing project
├── summary.md               ← Session summary
│
│   # Delivery Loop
├── brief.md                 ← Brief creation (PRD)
├── build.md                 ← Implement a brief
├── review.md                ← Review implementation
├── refine.md                ← Address feedback
│
│   # Project Commands
├── plan.md                  ← Feature planning
├── design.md                ← Visual identity design
├── align.md                 ← Vision alignment
│
│   # Support Commands
├── next.md                  ← Recommend the next best action
├── think.md                 ← Think through idea
├── decide.md                ← Make a decision
├── debug.md                 ← Debugging workflow
│
│   # Repo Commands
├── code.md                  ← Coding session
├── setup.md                 ← Project initialization
├── status.md                ← State of play
├── audit.md                 ← Quality audit
├── harden.md                ← Pre-promotion hardening
├── release.md               ← Release preparation
├── promote.md               ← Stage advancement
└── help.md                  ← Show available commands

catalyst/prompts/            ← DETAILED PROMPTS
├── chat-start.md            ← New chat prompt
├── chat-continue.md         ← Continue chat prompt
├── loop-1-brief.md          ← Brief creation prompt
├── loop-2-build.md          ← Build prompt
├── loop-3-review.md         ← Review prompt
├── loop-4-refine.md         ← Refine prompt
├── project-*.md             ← Project prompts
├── support-*.md             ← Support prompts
├── repo-*.md                ← Repo prompts
├── create-*.md              ← Artefact creation prompts
└── archive/                 ← Old prompts (reference only)

.claude/commands/            ← Claude Code pointers
├── code.md                  → @catalyst/commands/code.md
├── build.md                 → @catalyst/commands/build.md
└── ...

.github/prompts/             ← VS Code Copilot pointers
├── code.prompt.md           → @catalyst/commands/code.md
├── build.prompt.md          → @catalyst/commands/build.md
└── ...
```

**Why this structure?**
- Single source of truth — edit once, both tools get updates
- Commands are thin — reference detailed prompts in `/catalyst/prompts/`
- Commands live with Catalyst methodology, not with tooling
- Easy to add tool-specific commands in respective folders
- Clear separation of content from discovery mechanism

---

## How Slash Commands Work

Slash commands are reusable prompts defined as Markdown files. When you type `/command-name` in chat, the AI receives the command content as instructions.

**Key principle:** Commands are instructions FOR the AI, not messages TO the user.

---

## File Format

Commands use Markdown with optional YAML frontmatter:

```markdown
---
description: Brief description shown in /help
allowed-tools: Read, Bash(git:*)    # Claude Code only
argument-hint: [optional-args]       # Shown in autocomplete
model: sonnet                        # Optional: haiku, sonnet, opus
---

Instructions for the AI go here.

This is what the AI will do when /command is invoked.
```

### Frontmatter Fields

| Field | Purpose | Required |
|-------|---------|----------|
| `description` | Shows in `/help` output | Recommended |
| `allowed-tools` | Restrict which tools command can use | Claude only |
| `argument-hint` | Documents expected arguments | Optional |
| `model` | Specify model (haiku/sonnet/opus) | Claude only |

---

## Dynamic Features

### Arguments

- `$ARGUMENTS` — All arguments as single string
- `$1`, `$2`, `$3` — Positional arguments

```markdown
Review @$1 for security issues.
```

Usage: `/review src/api/auth.ts`

### File References

- `@path/to/file` — Include file contents in prompt

```markdown
Compare @package.json with @tsconfig.json
```

### Bash Execution (Claude Code only)

- `` !`command` `` — Execute and include output

```markdown
Current branch: !`git branch --show-current`
```

---

## Available Commands

### Chat Commands

| Command | Purpose | Arguments |
|---------|---------|-----------|
| `/chat` | Start a new thinking/project chat | — |
| `/continue` | Continue an existing project with context | — |
| `/summary` | Summarise the current chat for handoff | `[optional-title]` |

### Delivery Loop Commands

| Command | Purpose | Arguments |
|---------|---------|-----------|
| `/brief` | Create a new brief (PRD) | `[feature-name]` |
| `/build` | Implement a brief — take PRD to code | `[brief-name]` |
| `/review` | Review implementation against brief | `[brief-name]` |
| `/refine` | Address review feedback, close the loop | — |

### Project Commands

| Command | Purpose | Arguments |
|---------|---------|-----------|
| `/plan` | Plan a feature/initiative and generate briefs | `[initiative-or-feature]` |
| `/design` | Design visual identity (colors, mood, brand) | — |
| `/align` | Stress-test alignment with vision | — |

### Support Commands

| Command | Purpose | Arguments |
|---------|---------|-----------|
| `/next` | Recommend the next best action | `[goal-or-stuck-point]` |
| `/think` | Think through an idea or problem | `[topic]` |
| `/decide` | Make a decision with clear trade-offs | `[decision-topic]` |
| `/debug` | Structured debugging approach | `[issue-description]` |

### Repo Commands

| Command | Purpose | Arguments |
|---------|---------|-----------|
| `/code` | Start a coding session with project context | — |
| `/setup` | Initialize a new Catalyst project | — |
| `/status` | Get project state of play | — |
| `/audit` | Run quality audit | `[type] [stage] [scope]` |
| `/harden` | Pre-promotion hardening checklist | `[target-stage]` |
| `/release` | Prepare a release (changelog, version bump) | `[patch\|minor\|major]` |
| `/promote` | Advance stage (POC→MVP→MMP→PROD) | `[target-stage]` |
| `/help` | Show available commands | — |

---

## Catalyst Delivery Loop

The core Catalyst workflow is Brief → Build → Review → Refine:

```
/brief → /build → /review → /refine → (loop or ship)
```

1. **/brief** — Define what to build (PRD)
2. **/build** — Implement the brief
3. **/review** — Validate against requirements
4. **/refine** — Address feedback, close the loop

After the loop, either ship or create a new brief.

---

## New Project Quickstart

Recommended sequence for a fresh Catalyst project:

1. `/setup` — configure the project and clear kit artefacts
2. `/design` — establish visual identity (colors, mood, brand)
3. `/plan` — plan v0.1 and generate initial briefs
4. `/brief` → `/build` → `/review` → `/refine` — build features
5. `/release` — ship a clean release commit when ready

---

## Command Design Principles

1. **Single responsibility** — One command, one clear task
2. **Clear descriptions** — Self-explanatory in `/help`
3. **Document arguments** — Always use `argument-hint` if applicable
4. **Instructions, not explanations** — Tell the AI what to do
5. **Reference existing docs** — Use `@` to include context files

---

## Creating New Commands

1. Create command in `/catalyst/commands/new-command.md`
2. Add YAML frontmatter with at least `description`
3. Write instructions for the AI (not explanations for users)
4. Create pointers:
   - `.claude/commands/new-command.md`
   - `.github/prompts/new-command.prompt.md`
5. Test with `/new-command` in chat

### Pointer Template

**Claude Code** (`.claude/commands/name.md`):
```markdown
---
description: Same description as source
---

@catalyst/commands/name.md
```

**VS Code Copilot** (`.github/prompts/name.prompt.md`):
```markdown
---
description: Same description as source
---

@catalyst/commands/name.md
```

---

## Tool-Specific Commands

For commands that only work in one tool:
- **Claude only:** Add full content directly to `.claude/commands/`
- **Copilot only:** Add full content directly to `.github/prompts/`

No need to add to `/catalyst/commands/` — these are tool-specific, not shared.

---

## References

- [Claude Code Custom Commands](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
- [VS Code Prompt Files](https://code.visualstudio.com/docs/copilot/chat/prompt-files)
