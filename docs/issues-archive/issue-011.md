# Issue #11: Enhancement: Default new sessions to Yolo permission mode

| Field | Value |
|-------|-------|
| **State** | CLOSED |
| **Created** | 2026-01-06T16:43:19Z |
| **Closed** | 2026-01-07T20:23:25Z |
| **Author** | @MattStarfield |
| **Labels** | enhancement |

---

## Description

## Summary

Change the default permission mode for new sessions from "default" to "Yolo" (bypassPermissions) to reduce friction for power users who frequently work in unrestricted mode.

## Context

Currently, new sessions start in the restrictive "default" permission mode, requiring users to manually switch to Yolo mode at the start of each session. Power users who prefer unrestricted workflows must perform this switch repeatedly, adding friction to their daily workflow.

The permission mode system is already well-implemented with the ability to switch modes after session creation, so defaulting to Yolo provides the fastest path for power users while maintaining flexibility for those who want more control.

## Desired Outcome

**User Story**: As a power user who frequently uses HAPI, I want new sessions to start in Yolo permission mode by default, so that I can work faster without manually switching modes each time.

**Behavior**:
- New sessions start in Yolo permission mode (`bypassPermissions` for Claude, `yolo` for Codex)
- Users can still manually switch to a different permission mode after session starts via the existing UI controls
- Works consistently across all session creation methods (web UI, CLI, daemon)

## Implementation Path

1. **Primary change**: Modify `cli/src/daemon/run.ts` in the `spawnSession` function
   - Change line ~179 from `const yolo = options.yolo === true;` to `const yolo = options.yolo !== false;` (default true)
   
2. **Optional documentation**: Update `cli/src/modules/common/rpcTypes.ts` to document the new default behavior in `SpawnSessionOptions` interface

3. **No web UI changes required**: The web UI (`SpawnSession.tsx`) does not currently pass `yolo` parameter, so it will inherit the new daemon default

## Affected Components

| File | Change |
|------|--------|
| `cli/src/daemon/run.ts:179` | Change default yolo behavior from false to true |
| `cli/src/modules/common/rpcTypes.ts` | Optional: Add JSDoc comment documenting default |

## Acceptance Criteria

- [ ] New sessions spawned via web UI start in Yolo permission mode
- [ ] New sessions spawned via daemon RPC start in Yolo permission mode  
- [ ] New sessions spawned via CLI (without `--yolo` flag) start in Yolo permission mode
- [ ] Users can still switch to a different permission mode after session creation
- [ ] Existing `--yolo` CLI flag continues to work (no-op since already default)
- [ ] Passing `yolo: false` explicitly still creates non-yolo session

## Risk Assessment

**Breaking Changes**: None - existing mode switching functionality preserved
**Dependencies**: None
**Testing Required**: 
- Manual verification of session creation via web UI
- Manual verification of session creation via CLI
- Verify mode switching still works post-creation

## Future Consideration

A follow-up enhancement could make the default permission mode a user preference setting, allowing users to configure their preferred default. This issue focuses on the simpler change of setting a sensible default for power users.

---

## Comments

