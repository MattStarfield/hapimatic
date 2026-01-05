# HAPImatic

A customized fork of [HAPI](https://github.com/tiann/hapi) with personalized PWA branding for remote Claude Code access via smartphone.

## What is HAPImatic?

HAPImatic provides local-first remote access to Claude Code sessions through a web browser or Progressive Web App (PWA). This fork adds custom branding (mint green theme, custom icon) while maintaining full upstream compatibility.

**Original Project**: [tiann/hapi](https://github.com/tiann/hapi)

## Quick Reference

| Aspect | Value |
|--------|-------|
| Web UI | `http://rp1:3007` (via Tailscale) |
| Port | 3007 |
| Service | `hapimatic.service` |
| Data Directory | `~/.hapimatic/` |

### CLI Commands

```bash
hm              # Start Claude Code session
hm-resume       # Resume last session
hm-status       # Check service status
hm-logs         # View logs (follow mode)
hm-restart      # Restart service
```

## Installation Paths

```
~/projects/hapimatic/           # Source code (this repo)
├── web/                        # Frontend/PWA (customizations here)
├── cli/                        # CLI source
└── server/                     # Server source

~/.local/bin/hapimatic          # Compiled ARM64 binary
~/scripts/hapimatic             # CLI wrapper script
~/.hapimatic/                   # Runtime data
├── settings.json               # Token & configuration
├── hapi.db                     # Session database
└── logs/                       # Server logs

~/.config/systemd/user/hapimatic.service  # Systemd service
```

## Updating

### Update Claude Code

Claude Code is installed separately via npm. HAPImatic uses whatever version is installed on the system.

```bash
# Check current version
claude --version

# Update Claude Code
npm update -g @anthropic-ai/claude-code

# Verify update
claude --version
```

### Update HAPImatic (Sync with Upstream HAPI)

When upstream HAPI has new features or fixes:

```bash
# 1. Fetch upstream changes
cd ~/projects/hapimatic
git fetch upstream

# 2. Check what's new
git log HEAD..upstream/main --oneline

# 3. Merge upstream
git checkout main
git merge upstream/main

# 4. Resolve conflicts (if any) - keep our customizations in:
#    - web/vite.config.ts (name, colors)
#    - web/index.html (title, meta tags)
#    - web/src/App.tsx, web/src/components/*.tsx (branding text)
#    - web/public/*.png (icons - keep ours entirely)

# 5. Rebuild
bun install
bun run build:single-exe

# 6. Install updated binary
cp cli/dist-exe/bun-linux-arm64/hapi ~/.local/bin/hapimatic

# 7. Restart service
systemctl --user restart hapimatic

# 8. Verify
hm-status
curl -s http://localhost:3007 | grep -i hapimatic
```

## Customizations Applied

This fork modifies only visual/branding elements to maintain easy upstream merging:

### Theme Colors
- Primary: `#5ae6ab` (mint green)
- Background: `#0f1f1a` (dark)

### Files Modified from Upstream

| File | Changes |
|------|---------|
| `web/vite.config.ts` | PWA manifest: name, colors |
| `web/index.html` | Title, meta tags, theme colors |
| `web/src/App.tsx` | Branding text |
| `web/src/components/InstallPrompt.tsx` | "Install HAPImatic" text |
| `web/src/components/LoginPrompt.tsx` | Login screen branding |
| `web/src/sw.ts` | Notification default title |
| `web/public/*.png` | Custom generated icons |

## Service Management

```bash
# Status
systemctl --user status hapimatic

# Start/Stop/Restart
systemctl --user start hapimatic
systemctl --user stop hapimatic
systemctl --user restart hapimatic

# Logs
journalctl --user -u hapimatic -f

# Enable/Disable auto-start
systemctl --user enable hapimatic
systemctl --user disable hapimatic
```

## Comparison with Original HAPI

Both run simultaneously on the same Pi:

| Aspect | HAPI (original) | HAPImatic (this fork) |
|--------|-----------------|----------------------|
| Port | 3006 | 3007 |
| Data | `~/.hapi/` | `~/.hapimatic/` |
| Service | `hapi.service` | `hapimatic.service` |
| Command | `hapi` | `hm` |
| Branding | Default HAPI | Custom mint green |

## CLI Wrapper Details

The `~/scripts/hapimatic` wrapper sets environment variables for proper isolation:

```bash
export HAPI_HOME="$HOME/.hapimatic"
export WEBAPP_PORT="3007"
export HAPI_SERVER_URL="http://localhost:3007"
export CLI_API_TOKEN="<auto-extracted from settings.json>"
```

This ensures CLI commands connect to HAPImatic (port 3007), not the original HAPI (port 3006).

## Troubleshooting

### Authentication Error (401)

If `hm` fails with "Authentication error: Request failed with status code 401":

1. Ensure `HAPI_SERVER_URL` is set in `~/scripts/hapimatic`
2. Check token exists in `~/.hapimatic/settings.json`
3. Verify service is running: `hm-status`

### Service Won't Start

```bash
# Check logs for errors
journalctl --user -u hapimatic --no-pager | tail -50

# Verify binary exists
ls -la ~/.local/bin/hapimatic

# Check port availability
ss -tlnp | grep 3007
```

### PWA Not Updating

Clear browser cache or uninstall/reinstall the PWA on your device.

## License

This fork inherits the [AGPL-3.0 license](https://github.com/tiann/hapi/blob/main/LICENSE) from the original HAPI project.

## Acknowledgments

- [tiann/hapi](https://github.com/tiann/hapi) - The original HAPI project
- Built for remote Claude Code access on Raspberry Pi 5
