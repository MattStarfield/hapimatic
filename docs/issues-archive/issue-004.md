# Issue #4: Session title bar does not update when changing working directory mid-session

| Field | Value |
|-------|-------|
| **State** | CLOSED |
| **Created** | 2026-01-06T16:05:26Z |
| **Closed** | 2026-01-07T20:52:27Z |
| **Author** | @MattStarfield |
| **Labels** | None |

---

## Description

## Description

When a user instructs Claude to change to a different working directory during an active session, the working directory path displayed in the session title bar does not update to reflect the new location.

## Steps to Reproduce

1. Start a new Claude Code session in directory A (e.g., `/mnt/docker/genai-playground-dev`)
2. During the session, instruct Claude to change working directory to directory B (e.g., `~/projects/hapimatic`)
3. Claude successfully changes to the new directory and operates from there
4. Observe the session title bar still shows the original directory A

## Expected Behavior

The session title bar should update to display the current working directory when Claude changes directories mid-session.

## Actual Behavior

The title bar continues to show the original directory from session start, even though Claude is now operating from a different location.

## Impact

- User confusion about which directory Claude is actually working in
- Potential for mistakes when managing multiple projects
- Inconsistency between displayed state and actual state

---

## Comments

### @MattStarfield on 2026-01-07T20:48:50Z

## Analysis: Expected Behavior (Not a Bug)

After investigating the codebase, this is **expected behavior** - the session path represents where the session was spawned from, not Claude Code's current working directory.

### How it works

1. **Session Creation** (`cli/src/daemon/run.ts`): The `directory` parameter is captured when spawning and stored in `metadata.path`

2. **No Change Detection**: Claude Code doesn't emit events when its working directory changes via `cd` or other means

3. **Design Intent**: The path represents the "project root" - where you launched the session from

### Technical Challenge

When Claude runs `cd /different/path`, HAPImatic has no way to detect this because:
- The Claude Code SDK doesn't provide a working directory change event
- There's no API to query Claude's current working directory
- Parsing bash commands for `cd` is unreliable (misses pushd, scripts, sourced files, etc.)

### Recommendation

**Close as "by design"** OR **re-label as "enhancement"**

If kept as an enhancement, implementation options:
1. **Upstream request**: Ask Anthropic to add cwd change events to Claude Code SDK
2. **Best-effort tracking**: Parse tool calls for directory changes (fragile)
3. **User-triggered refresh**: Let user manually update session path

### User's Valid Point

From a UX perspective, showing the *current* working directory would be more informative than the *initial* directory. This is a reasonable enhancement request, but technically challenging given the current Claude Code architecture.

---

### @MattStarfield on 2026-01-07T20:52:27Z

Closing as by design. The session path represents the project root where the session was launched, not Claude's current working directory. See analysis comment above for technical details.

---

