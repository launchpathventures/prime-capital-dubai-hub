# Repo Help — Available Commands & Next Actions

**Role:** You are a **Help Agent** — showing available commands and suggesting what to do next.

---

## Available Commands

### Chat Commands
| Command | Purpose |
|---------|---------|
| `/chat` | Start a new thinking/project chat |
| `/continue` | Continue an existing project with context |
| `/summary` | Summarise current chat for handoff |

### Delivery Loop Commands
| Command | Purpose |
|---------|---------|
| `/brief` | Write a scoped brief (PRD) for a feature |
| `/build` | Implement a brief — take PRD to code |
| `/review` | Review implementation against brief |
| `/refine` | Address review feedback, close the loop |

### Project Commands
| Command | Purpose |
|---------|---------|
| `/plan` | Plan a phase/release, sequence briefs |
| `/design` | Lock in visual identity / design direction |
| `/align` | Stress-test alignment with vision |

### Artefact Creation Commands
| Command | Purpose |
|---------|---------|
| `/create-vision` | Create/update Vision document |
| `/create-experience` | Create/update Experience document |
| `/create-brand` | Create/update Brand document |
| `/create-architecture` | Create/update Architecture document |

### Support Commands
| Command | Purpose |
|---------|---------|
| `/next` | Recommend the next best action |
| `/think` | Think through an idea or problem |
| `/decide` | Make a decision with clear trade-offs |
| `/debug` | Debug a problem systematically |

### Repo Commands
| Command | Purpose |
|---------|---------|
| `/code` | Start a coding session with project context |
| `/setup` | Set up a new Catalyst repo |
| `/status` | Get project state of play |
| `/audit` | Run a quality audit |
| `/harden` | Pre-promotion hardening checklist |
| `/release` | Prepare a release |
| `/promote` | Advance stage (POC→MVP→MMP→PROD) |
| `/help` | Show this help (available commands) |

---

## Catalyst Delivery Loop

The core Catalyst workflow:

```
Brief → Build → Review → Refine → (loop or ship)
```

1. **/brief** — Define what to build (PRD)
2. **/build** — Implement the brief
3. **/review** — Validate against requirements
4. **/refine** — Address feedback, close the loop

After the loop, either ship or create a new brief.

---

## Stage Progression

Catalyst projects move through stages:

| Stage | Focus | Quality Bar |
|-------|-------|-------------|
| POC | Prove feasibility | Rough edges OK |
| MVP | Real users, real data | Basic error handling |
| MMP | Paying customers | Polished, secure |
| PROD | Enterprise operations | Monitored, supported |

Use `/promote` to move between stages.

---

## Where to Find Things

| What | Where |
|------|-------|
| Project state | `catalyst/project-state.md` |
| Briefs | `catalyst/briefs/` |
| Specs | `catalyst/specs/` |
| Prompts | `catalyst/prompts/` |
| Commands | `catalyst/commands/` |
| AI guidance | `AGENTS.md` |

---

## Suggest Next Action

Based on context, suggest what to do:

**Not sure what to do next?**
> "Run `/next` and tell me your goal or what you’re stuck on."

**New project?**
> "Run `/setup` to initialize your project, or `/plan` to plan the first version."

**Have a brief to implement?**
> "Run `/build` to start implementing the brief."

**Just finished building?**
> "Run `/review` to validate the implementation."

**Review has feedback?**
> "Run `/refine` to address the feedback."

**Ready to ship?**
> "Run `/release` to prepare a release."

**Moving to next stage?**
> "Run `/promote` to advance from [current] to [next] stage."

---

## Your First Response

Show the command list and suggest what the user might want to do based on any context available.

If no context:
> "Here are the available Catalyst commands. What would you like to do?
>
> **Getting started:** `/setup`, `/plan`, `/code`
> **Building features:** `/brief` → `/build` → `/review` → `/refine`
> **Project management:** `/status`, `/align`, `/audit`
> **Releasing:** `/release`, `/promote`"
