# Catalyst Changelog

All notable changes to the Catalyst method.

This changelog tracks changes to:
- Method documentation (CATALYST.md, PLAYBOOK.md, GLOSSARY.md, etc.)
- Commands and prompts
- Workflow and conventions

Kit components (modules, UI, surfaces) are tracked separately in project changelogs.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Changed
- **Breaking:** Separated method from project artifacts
  - Method files now live in `/.catalyst/` (upstream, replaceable)
  - Project files remain in `/catalyst/` (specs, briefs, project-state)
  - Upgrade path: replace `/.catalyst/` folder to update method

### Added
- `LEARNINGS.md` — Structured file for capturing common AI mistakes
- `/learn` command — Quickly capture feedback about patterns AI agents get wrong

---

## [0.9.0] - 2026-01-08

### Added
- Project initialization via `/setup` (cleanly converts the kit into a new project)
- Project state version tracking (`project_version`, `catalyst_version`, `catalyst_ref`)

### Changed
- Dashboard polish (stages, dialogs, workflow links)

---

## [0.8.0] - 2026-01-07

### Added
- Workflow automation via slash commands (`/code`, `/brief`, `/audit`, `/debug`, `/harden`, `/align`, `/status`, `/summary`)

### Changed
- Commands consolidated to single source of truth
- Brief workflow refined for consistent agent behaviour

---

## [0.7.0] - 2026-01-07

### Added
- Briefs system (brief states, dashboard views, utilities)
- Catalyst dashboard foundations

### Changed
- Project definition structure to 4-spec model (Vision / Experience / Brand / Architecture)

---

## [0.6.0] - 2026-01-07

### Added
- Supabase realtime integration patterns

---

## [0.5.0] - 2026-01-06

### Added
- Modules scaffold and conventions

---

## [0.4.0] - 2026-01-04

### Changed
- Glossary, key terms, and prompts refined for consistent language

---

## [0.3.0] - 2026-01-02

### Added
- Workflow stage docs (POC/MVP/MMP/Production)
- Audit framework docs
- Prompt library expansion (debugging, audits, hardening, promotions)

---

## [0.2.0] - 2026-01-02

### Added
- Catalyst folder restructure
- Docs foundations (prompts/docs surfacing, workflow guidance)

---

## [0.1.0] - 2026-01-01

### Added
- Initial Catalyst method documentation
