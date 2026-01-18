# Prime Capital Dubai Hub

**Real estate advisory platform with RERA certification training.**

A boutique real estate advisory platform for discerning international investors seeking quality exposure to Dubai's premium property market. Includes a comprehensive learning management system for RERA certification training.

## Features

- **Marketing Website** — Lead capture, property showcase, team profiles
- **RERA Training LMS** — 9 competencies, quizzes, scenarios, AI coaching
- **Admin Tools** — Content management, lead tracking, analytics

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Git
- VS Code with Copilot (recommended)

### Setup

```bash
pnpm install
cp .env.example .env.local   # Mac/Linux
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

| Surface | Path | Purpose |
|---------|------|---------|
| Website | `/` | Marketing, lead capture |
| Learning | `/learn` | RERA training LMS |
| App | `/app` | Internal tools |
| Docs | `/docs` | Documentation |

## Learn More

- [AGENTS.md](./AGENTS.md) — AI agent instructions
- [Catalyst Docs](http://localhost:3000/docs) — methodology, patterns
- [Next.js Documentation](https://nextjs.org/docs) — framework reference

## Deploy

Deploy to [Vercel](https://vercel.com/new) or see the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).
