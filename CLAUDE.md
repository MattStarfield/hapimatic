# CLAUDE.md

Project-specific instructions for Claude Code when working with HAPImatic.

## Project Overview

HAPImatic is a customized fork of [HAPI](https://github.com/tiann/hapi) with personalized PWA branding (mint green theme) for remote Claude Code access.

See `README.md` for full documentation and `AGENTS.md` for architecture details.

---

## ⚠️ CRITICAL: Server Restart Warning

**STOP and WARN the user before performing ANY operation that would restart the HAPImatic server.**

Restarting the HAPImatic server (port 3007) will **immediately disconnect ALL active HAPI sessions**, including:
- Any Claude Code sessions being controlled remotely via the PWA
- The current session if it's running through HAPImatic itself

### Operations That Require Server Restart

You MUST warn the user before:
- Running `systemctl --user restart hapimatic`
- Running `systemctl --user stop hapimatic`
- Killing hapimatic processes (`pkill hapimatic`)
- Replacing the binary at `~/.local/bin/hapimatic`
- Running `hm update` (which restarts the service)
- Any rebuild + deploy workflow

### Required Warning Format

Before proceeding with any restart operation, display this warning:

```
⚠️  SERVER RESTART REQUIRED

This operation will restart the HAPImatic server and DISCONNECT ALL ACTIVE SESSIONS.

Any Claude Code sessions currently running through HAPImatic will be terminated.
Work in progress in other sessions may be interrupted.

Are you sure you want to proceed? (Consider completing or saving work in other sessions first)
```

**Wait for explicit user confirmation before proceeding.**

### Safe Operations (No Warning Needed)

These do NOT require a restart:
- Code changes without deployment
- `bun run typecheck`, `bun run test`
- Git operations (commit, push, pull)
- Editing source files
- Building without deploying (`bun run build` without copying binary)

---

## Screenshots and Images

**Screenshot Directory**: `/mnt/netshare/img`

When Matt mentions saving a screenshot or references an image for this project, the file will be located in `/mnt/netshare/img`. Use the Read tool to view images from this directory without asking for the full path.

Example: "I saved a screenshot of the error" → Check `/mnt/netshare/img` for recent files.

## Key Customization Files

When merging upstream changes, preserve customizations in these files:
- `web/vite.config.ts` - PWA manifest (name, colors)
- `web/index.html` - Title, meta tags, theme colors
- `web/src/App.tsx` - Branding text
- `web/src/components/InstallPrompt.tsx` - Install prompt text
- `web/src/components/LoginPrompt.tsx` - Login screen branding
- `web/src/sw.ts` - Notification title
- `web/public/*.png` - Custom icons (keep entirely)
- `web/public/icon-source.svg` - Icon source file

## Theme Colors

- Primary: `#5ae6ab` (mint green)
- Background: `#0f1f1a` (dark)

## Development

```bash
bun run dev          # Start dev servers
bun run typecheck    # Type checking
bun run test         # Run tests
bun run build:single-exe  # Build ARM64 binary
```

## Deployment

**Claude CAN and SHOULD deploy autonomously** when the user requests deployment or approves changes that require it. Do NOT ask the user to run these commands manually.

### Deployment Procedure

After building with `bun run build:single-exe`, deploy the new binary:

```bash
# 1. Stop the service
systemctl --user stop hapimatic

# 2. Kill any lingering processes (handles "Text file busy" error)
pkill -9 -f hapimatic; sleep 2

# 3. Copy new binary
cp cli/dist-exe/bun-linux-arm64/hapi ~/.local/bin/hapimatic

# 4. Start service and verify
systemctl --user start hapimatic
systemctl --user status hapimatic --no-pager
```

### Important Notes

- **Always warn user first** about session disconnection (see Server Restart Warning above)
- If `cp` fails with "Text file busy", use `pkill -9 -f hapimatic` to kill lingering processes
- Verify service is running after deployment with `systemctl --user status hapimatic`

---

## 🔴 MANDATORY: Playwright Verification Before User Testing

**You MUST verify UI changes with Playwright BEFORE asking the user to test on their device.**

This is a CRITICAL requirement. Do NOT skip this step. The user should NEVER be the first to discover that changes aren't working.

### Required Verification Steps

After deploying any UI changes:

1. **Close any existing browser tabs**: `mcp__playwright__browser_close`
2. **Navigate fresh**: `mcp__playwright__browser_navigate` to `http://localhost:3007`
3. **Take a screenshot**: `mcp__playwright__browser_take_screenshot`
4. **Visually inspect** the screenshot to confirm your changes are visible
5. **Only then** inform the user that changes are ready for testing

### Common Pitfalls

- **Build caching**: If changes aren't visible, delete `web/dist/` and rebuild
- **Binary not copied**: Verify timestamps match between `cli/dist-exe/` and `~/.local/bin/hapimatic`
- **Service not restarted**: The old binary may still be running
- **Browser caching**: Close Playwright browser and navigate fresh

### Failure to Verify = Wasted User Time

If you skip Playwright verification and ask the user to test, only for them to find the changes aren't working, you have:
1. Wasted the user's time switching to their phone
2. Damaged trust in your work quality
3. Violated this CLAUDE.md directive

**Always verify first. No exceptions.**
