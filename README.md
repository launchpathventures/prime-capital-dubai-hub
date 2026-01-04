# Catalyst

**Ship production-ready outcomes in weeks, not months.**

Catalyst is the AI-first way to run delivery without losing alignment as speed increases. It combines:

- **A repeatable delivery method** — how you run the project week-to-week with AI in the loop
- **A development kit** (this repo) — what makes that method fast to execute

Most delivery doesn't fail because teams can't build. It fails because teams build fast in the wrong direction. Catalyst keeps you aligned.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Git
- VS Code with Copilot (recommended)

### Create Your Project

**Option A: GitHub Web (simplest)**

1. Go to [WEARERIVER/catalyst-ai-dev-kit](https://github.com/WEARERIVER/catalyst-ai-dev-kit)
2. Click **"Use this template"** → **"Create a new repository"**
3. Name your project (e.g., `my-project`) and create
4. Copy your new repo URL from the green **Code** button
5. Clone in terminal:
   ```bash
   git clone https://github.com/YOUR-ORG/my-project.git
   ```
   *(Replace `YOUR-ORG/my-project` with your actual repo URL)*

**Option B: GitHub CLI (one command)**

```bash
gh repo create my-project --template WEARERIVER/catalyst-ai-dev-kit --private --clone
```

> ⚠️ **Never clone Catalyst directly** — your commits would target the wrong repo.

### Initialize

```bash
cd my-project
pnpm install
copy .env.example .env.local   # Windows
# cp .env.example .env.local   # Mac/Linux
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you're ready to build.

### Start Building with AI

Open VS Code, start a new AI chat, and attach the starter prompt:

```
catalyst/prompts/codingai-1-starter.md
```

AI will reply "Yes" when ready. Then describe what you want to build.

## Learn More

- [Catalyst Docs](http://localhost:3000/docs) — methodology, patterns, components
- [AGENTS.md](./AGENTS.md) — AI agent instructions (read this if using Copilot/Cursor)
- [Next.js Documentation](https://nextjs.org/docs) — framework reference

## Deploy

The easiest way to deploy is [Vercel](https://vercel.com/new). See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for other options.
