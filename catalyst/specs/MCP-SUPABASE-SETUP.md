# MCP Supabase Setup for VS Code

This guide explains how to configure VS Code's MCP (Model Context Protocol) to connect to a specific Supabase project per repository.

---

## Quick Setup

Create a `.vscode/mcp.json` file in your project root:

```json
{
  "servers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref", "YOUR_PROJECT_REF"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "${env:SUPABASE_ACCESS_TOKEN}"
      }
    }
  }
}
```

Replace `YOUR_PROJECT_REF` with your Supabase project reference.

---

## Finding Your Project Ref

Your project ref is in the Supabase dashboard URL:

```
https://supabase.com/dashboard/project/XXXXXXXXXXXXXX
                                        ^^^^^^^^^^^^^^
                                        This is your project-ref
```

Or from your API URL:

```
https://XXXXXXXXXXXXXX.supabase.co
        ^^^^^^^^^^^^^^
        This is your project-ref
```

---

## Setting Up the Access Token

The access token is **account-level** (works for all your Supabase projects).

### 1. Generate a Token

1. Go to https://supabase.com/dashboard/account/tokens
2. Click "Generate new token"
3. Give it a name (e.g., "VS Code MCP")
4. Copy the token (starts with `sbp_`)

### 2. Add to Shell Profile

Add to `~/.zshrc` (or `~/.bashrc`):

```bash
export SUPABASE_ACCESS_TOKEN="sbp_your_token_here"
```

Then reload:

```bash
source ~/.zshrc
```

### 3. Reload VS Code

After setting the environment variable:
1. `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Search "Developer: Reload Window"
3. Press Enter

---

## Example Configurations

### Project A (e.g., prime-capital-dubai)

```json
{
  "servers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref", "vhgtbeimnkitqgekvtrz"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "${env:SUPABASE_ACCESS_TOKEN}"
      }
    }
  }
}
```

### Project B (another app)

```json
{
  "servers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref", "abcdefghijklmnop"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "${env:SUPABASE_ACCESS_TOKEN}"
      }
    }
  }
}
```

---

## Prompt for AI Assistant

Use this prompt in a new project to set up MCP:

> Create a `.vscode/mcp.json` file for Supabase MCP with project ref `YOUR_PROJECT_REF`

---

## Troubleshooting

### MCP not connecting

1. Check that `SUPABASE_ACCESS_TOKEN` is set: `echo $SUPABASE_ACCESS_TOKEN`
2. Ensure VS Code was restarted after setting the env var
3. Check the project ref is correct (20 characters, lowercase)

### Wrong project connected

1. Verify the `--project-ref` in `.vscode/mcp.json`
2. Reload VS Code window
3. Check with: ask the AI "What Supabase project are you connected to?"

---

## Security Notes

- Never commit `.env.local` or tokens to git
- The `.vscode/mcp.json` file is safe to commit (uses env var reference)
- Access tokens can be revoked at https://supabase.com/dashboard/account/tokens
