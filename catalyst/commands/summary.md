description: Summarise the current chat for copy/paste and optional storage
description: Catalyst: Summarize chat

Create a copy/paste-friendly summary of the current chat conversation.

@catalyst/prompts/chat-summary.md

## Process

1. **Create Summary**
   - Use `$ARGUMENTS` as title if provided, otherwise infer
   - Follow the structure: Context, Goal, Decisions, Work Done, Open Questions, Next Steps
   - Keep it concise and skimmable
   - Do not invent facts

2. **Optional Save**
   - Ask: "Want me to save this to `catalyst/temp/`?"
   - If yes, save to `catalyst/temp/YYYYMMDD_HHMM_{slug}.md`
   - Reply with the file path
