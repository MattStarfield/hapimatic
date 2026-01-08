# Issue #22: feat(ui): Display current git branch in session UI

| Field | Value |
|-------|-------|
| **State** | OPEN |
| **Created** | 2026-01-08T02:02:39Z |
| **Closed** | N/A |
| **Author** | @MattStarfield |
| **Labels** | enhancement, ui |

---

## Description

## Summary

Display the current git branch prominently in the HAPImatic UI, mirroring the branch indicator behavior in the Claude Code terminal.

## Context

Claude Code in the terminal displays the current git branch and updates it automatically when the branch changes. This provides valuable context about which branch Claude is working on without needing to explicitly check. HAPImatic should replicate this UX for remote sessions.

## Current Behavior

- The session header shows a `worktree: <branch>` indicator, but only for git worktree sessions (line 125 of `SessionHeader.tsx`)
- The codebase already has infrastructure for git branch parsing (`web/src/lib/gitParsers.ts` with `GitBranchInfo` type and `getCurrentBranchV2()`)
- A `/sessions/:id/git-status` API endpoint exists that returns branch information

## Desired Outcome

1. **Visible branch indicator** - Display the current git branch prominently in the session UI (not just for worktrees)
2. **Automatic updates** - Branch indicator updates reactively when the user switches branches
3. **Additional context (optional)** - Consider showing ahead/behind counts relative to upstream (the parsing already supports this via `GitBranchInfo.ahead`/`behind`)

## Implementation Considerations

### UI Placement Options

1. **Session Header** - Extend existing header to show branch for all sessions (not just worktrees)
2. **Session Info Area** - Near the version display at the bottom of the chat
3. **Dedicated Branch Badge** - A styled git branch icon + name component

### Data Flow Questions

- **Polling vs Events**: The terminal likely uses filesystem events or process output. For HAPImatic, should we poll `/git-status` periodically, or is there a WebSocket/SSE channel that could push branch changes?
- **Session Path**: Branch detection requires `session.metadata.path` - need to handle sessions without a path gracefully
- **Detached HEAD**: Handle `(detached)` and `(initial)` states (already handled in `getCurrentBranchV2()`)

### Existing Infrastructure to Leverage

- `GitBranchInfo` type in `web/src/lib/gitParsers.ts` (oid, head, upstream, ahead, behind)
- `getCurrentBranchV2()` function for parsing
- `buildGitStatusFiles()` returns `branch` field
- `/sessions/:id/git-status` API endpoint
- `useGitStatusFiles` hook in `web/src/hooks/queries/`

## Affected Components

- [ ] `web/src/components/SessionHeader.tsx` - Most likely location for branch display
- [ ] `web/src/hooks/queries/useGitStatusFiles.ts` - May need to expose branch separately or add polling
- [ ] Possibly new `useBranchInfo` hook for focused branch-only queries

## Acceptance Criteria

- [ ] Current git branch is displayed in the session UI for all sessions with a valid path
- [ ] Branch indicator updates when user switches branches (within reasonable latency)
- [ ] Graceful handling of non-git directories (no branch shown)
- [ ] Graceful handling of detached HEAD state
- [ ] Visual design consistent with HAPImatic's mint green theme

## Open Questions

1. What polling interval is acceptable for branch updates? (5s? 10s? On user interaction?)
2. Should we show upstream tracking info (e.g., "main...origin/main +2 -1")?
3. Should clicking the branch show a dropdown of recent branches or just be informational?

## Server Restart Required

No - This is a UI-only feature change.

---

## Comments

