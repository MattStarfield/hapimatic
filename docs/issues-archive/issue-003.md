# Issue #3: UX: Improve discoverability of session deletion and management options

| Field | Value |
|-------|-------|
| **State** | CLOSED |
| **Created** | 2026-01-05T23:37:18Z |
| **Closed** | 2026-01-07T20:41:22Z |
| **Author** | @MattStarfield |
| **Labels** | enhancement, ui |

---

## Description

## Summary
Old/offline sessions accumulate in the session list over time, making it difficult to find active sessions. While session deletion functionality exists, it is not easily discoverable.

## Context
When using HAPImatic, sessions that have been opened and then closed remain in the session list even after they're offline. This causes visual clutter and makes it harder to locate currently running sessions. This behavior is inherited from the upstream HAPI project.

## Current Behavior
- Sessions persist in the list indefinitely after they go offline
- The only way to delete sessions is via long-press on a session item, which opens a context menu with:
  - **Rename** - always available
  - **Archive** - shown for active sessions (marks them inactive)
  - **Delete** - shown for inactive sessions (permanently removes)
- There is also a CLI cleanup script at `server/scripts/cleanup-sessions.ts` for bulk operations
- Users unfamiliar with the long-press gesture may not discover these options

## Desired Outcome
Make session management more discoverable. Options to consider:
1. Add a visible "Edit" or "Manage" button to the session list header
2. Add a swipe-to-delete gesture (common mobile pattern)
3. Add a "Clear old sessions" or "Cleanup" option in settings or session list header
4. Add tooltips or onboarding hints for new users
5. Show a subtle indicator that long-press is available

## Affected Components
- [x] `web/` - PWA frontend (SessionList.tsx, SessionActionMenu.tsx)
- [ ] `server/` - Backend server (already has cleanup-sessions.ts script)
- [ ] Documentation

## Acceptance Criteria
- [ ] Users can easily discover how to delete old/inactive sessions
- [ ] Session list remains manageable even with many historical sessions
- [ ] Solution works well on both mobile (PWA) and desktop browsers

## Technical Notes
- Session deletion API already exists via `api.deleteSession(sessionId)`
- The `SessionActionMenu` component already handles delete confirmation
- Cleanup script supports filtering by message count, path pattern, and orphaned sessions
- Consider whether to expose cleanup script functionality in the web UI

## Server Restart Required
No - this is a frontend-only change

---

## Comments

### @MattStarfield on 2026-01-05T23:44:02Z

## Research Findings: Why Sessions Are Retained

After investigating the HAPI codebase, the session retention behavior is **intentional by design**. Here's what we found:

### Design Rationale

**1. Session History / Project Organization**
Sessions are grouped by directory in the UI. Keeping offline sessions provides a history of all work done in each project folder - functioning as a project activity log.

**2. Two-Step Explicit Control Model**
The architecture separates two distinct operations:
- **Archive**: Disconnect an active session but preserve the record (`active = 0`)
- **Delete**: Permanently remove session and cascade-delete messages (only available for inactive sessions)

This gives users explicit control rather than auto-deleting sessions that might contain useful context.

**3. Resume/Reconnection Architecture**
The codebase has RPC infrastructure (`resumeSession` operations, session state management) suggesting sessions could potentially be resumed. Keeping session records enables this capability.

**4. Sorting Logic**
Offline sessions are sorted to rank 2 (bottom) vs active sessions at rank 0-1, so they're visually deprioritized but preserved for reference.

### Key Code Locations

| Component | File | Lines |
|-----------|------|-------|
| Session state logic | `server/src/sync/sessionCache.ts` | 176-269 |
| Archive endpoint | `server/src/web/routes/sessions.ts` | 82-95 |
| Delete endpoint | `server/src/web/routes/sessions.ts` | 211-237 |
| Frontend mutations | `web/src/hooks/mutations/useSessionActions.ts` | 39-47, 93-106 |
| UI status indicator | `web/src/components/SessionList.tsx` | 196-198 |

### Database Schema

```sql
CREATE TABLE sessions (
    ...
    active INTEGER DEFAULT 0,  -- 1 = running, 0 = offline/retained
    active_at INTEGER,
    ...
);
```

### Session State Transitions

```
Active Session (active=1)
    ↓ User clicks "Archive"
archiveSession() → killSession() RPC → handleSessionEnd()
    ↓
Offline Session (active=0)  ← Still visible in list (dimmed)
    ↓ User clicks "Delete" 
deleteSession() → SQLite DELETE with CASCADE
    ↓
Session permanently removed
```

### Conclusion

HAPI chose **user control over automation** - the philosophy is "we won't delete your session history; you decide when to clean up." This is a valid design choice prioritizing history preservation.

However, the **discoverability** of these controls is poor. The original issue remains valid: users need better visual cues and easier access to session management actions.

---

Given this understanding, the focus shifts from "missing feature" to "UX improvement" - making the existing archive/delete functionality more discoverable and potentially adding optional auto-cleanup settings.

---

### @MattStarfield on 2026-01-06T05:45:49Z

## Progress Update

### Completed ✅

**1. Bulk "Clear inactive" button**
- Added red trash icon to session list header
- Only visible when inactive sessions exist
- Shows confirmation dialog: "Delete X inactive sessions? This action cannot be undone."
- Implemented in `router.tsx` SessionsPage component

**2. Swipe-to-delete gesture**
- Left swipe on inactive sessions reveals red "Delete" button
- Only enabled for inactive sessions (active sessions are protected)
- Uses custom `useSwipe` hook following existing `useLongPress` pattern

### In Progress 🔄

**3. Visual hint for session actions**
- Original implementation used a grip icon (6-dot pattern) but this wasn't intuitive
- Changing to an info circle icon that users can tap to open the action menu directly
- More discoverable than relying on long-press gesture

### Screenshots
- Bulk delete button visible in header (red trash icon next to + button)
- Confirmation dialog shows count of inactive sessions to delete

---

### @MattStarfield on 2026-01-06T05:56:36Z

## Implementation Complete ✅

All three session management UX improvements are now working:

### 1. Swipe-to-delete gesture ✅
- Swipe left on inactive sessions reveals delete action
- Active sessions cannot be swiped (protected)

### 2. Bulk 'Clear inactive' button ✅
- Trash icon appears in header when inactive sessions exist
- Shows confirmation dialog with count before deleting

### 3. Info icon for session actions ✅ (updated approach)
- **Changed from grip icon to info circle icon** per user feedback
- Tapping the info icon (ⓘ) opens the Session Actions menu
- Menu provides Rename and Delete options
- Clicking elsewhere on the session row navigates to the session

### Technical Notes
- Changed outer session item from `<button>` to `<div role="button">` to allow nested info button
- Info button uses `stopPropagation()` to prevent navigation when clicked

All features verified working via Playwright testing.

---

### @MattStarfield on 2026-01-07T20:41:07Z

## Closing Notes

All three features from this issue have been implemented:

1. ✅ **Bulk "Clear inactive" button** - Red trash icon in header
2. ✅ **Swipe-to-delete gesture** - Left swipe reveals delete on inactive sessions
3. ✅ **Info icon for session actions** - Tap to open action menu

**Note:** A bug was discovered with the info icon implementation - clicking it navigates to the session instead of opening the action menu on desktop. This is tracked separately in #10.

Closing this issue as the features are implemented. The remaining bug is tracked in #10.

---

### @MattStarfield on 2026-01-07T20:41:22Z

Features implemented. Remaining bug tracked in #10.

---

