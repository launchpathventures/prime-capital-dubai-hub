## Handover Prompt — Project Architecture Document
_This prompt helps AI document a project's technical architecture, stack, and patterns._

@AI: You are now producing the **Project Architecture Document**.

**Stability note:** This prompt is intentionally stable. Only update it when the required structure, voice rules, or recurring AI failure modes indicate the template itself needs correcting.

This document defines **how the project is built technically** — the stack, patterns, conventions, and structures that make it work.

This is not a vision document (that's the north star).
This is not an experience document (that's users and journeys).
This is the **technical layer** that AI agents and developers need to understand to build correctly.

---

## Purpose of the Architecture Document

The Architecture Document should:
- Define the technology stack and key dependencies
- Document folder structure and organisation
- Establish coding patterns and conventions
- Explain data and API patterns
- Provide guidance for AI agents working in the codebase

A reader should be able to understand:
> "What technologies are used, how is the code organised, and what patterns should I follow?"

---

## Inputs You Will Receive

You may be given some or all of the following:
- Project name and description
- Existing codebase to analyse
- Technology choices already made
- Coding standards or conventions in use
- Any architectural constraints

If inputs are missing, **analyse the codebase** to discover patterns and document what exists.

---

## Required Structure

### 1. Overview
- What this document is for (technical architecture)
- Brief connection to other project docs
- When this document should be updated

### 2. Technology Stack
For each layer of the stack:
- Technology name and version
- Why it was chosen (briefly)
- Key features used

Categories:
- Core framework
- Styling approach
- UI components
- Authentication (if applicable)
- Database/data layer (if applicable)
- Development tools

### 3. Folder Structure
Provide a clear directory tree showing:
- Top-level folders and their purpose
- Key conventions (route groups, private folders, etc.)
- Where different types of code live

Include explanation of key conventions like:
- Route groups `(name)/`
- Private folders `_name/`
- Barrel exports
- Colocation patterns

### 4. Component Patterns
Document the component hierarchy:
- Types of components and where they live
- Naming conventions
- Decision flow for choosing component type
- Composition patterns

### 5. Styling Patterns
Document how styling works:
- Design tokens and CSS variables
- CSS layers and specificity
- When to use Tailwind vs custom CSS
- Dark mode approach

### 6. Data Patterns
Document how data flows:
- Current stage patterns (static, file-based, etc.)
- When database is needed
- API route conventions
- Server components vs client components

### 7. AI Integration Patterns
Document how AI agents work in this codebase:
- Entry points for AI (AGENTS.md, folder docs)
- What makes patterns AI-friendly
- Slash commands if available

### 8. Key Technical Decisions
For each major decision:
- What was chosen
- Why it was chosen
- Trade-offs accepted

Include decisions about:
- Framework choice
- Component library
- Styling approach
- Folder organisation

### 9. Technical Constraints
Document:
- Required tools (package manager, TypeScript, etc.)
- Things to avoid
- Performance targets (if defined)

### 10. Maintaining This Document
- When to update
- When NOT to update
- Links to related docs

---

## Style & Tone Requirements

- Write for **developers and AI agents**
- Be precise about technical details
- Use code examples where helpful
- Keep explanations concise
- Document what IS, not what SHOULD BE

---

## Quality Checks

Before finalising, verify:
- [ ] Stack is fully documented
- [ ] Folder structure is clear and complete
- [ ] Patterns are explained with examples
- [ ] Conventions are explicit (not implied)
- [ ] An AI agent could follow these patterns correctly

---

## Final Check Before Output

Ensure that:
- A new developer could understand the codebase structure
- An AI agent could follow the patterns correctly
- Technical decisions are explained, not just listed
- The document reflects reality, not aspirations

Now produce the **Project Architecture Document** in markdown code.
