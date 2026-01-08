# Issue #10: Bug: Info icon in session list opens session instead of showing hint text

| Field | Value |
|-------|-------|
| **State** | CLOSED |
| **Created** | 2026-01-06T16:43:00Z |
| **Closed** | 2026-01-08T00:01:14Z |
| **Author** | @MattStarfield |
| **Labels** | bug, ui |

---

## Description

## Summary

The circle "i" (info) icon displayed for each session in the session list triggers session navigation when clicked instead of showing tooltip/hint text as intended.

## Current Behavior

Clicking the info icon opens/navigates to the session, which is the same behavior as clicking on the session row itself.

## Expected Behavior

Clicking the info icon should display helpful hint text about the session (tooltip, popover, or similar UI element).

## Environment

- Desktop browser (not mobile)

## Root Cause Hypothesis

The click event on the info icon is likely bubbling up to the parent session row element, which has a click handler for session navigation. The info icon's click handler either:
1. Does not exist, or
2. Does not call `event.stopPropagation()` to prevent the event from bubbling

## Implementation Path

1. Locate the session list component and info icon element
2. Verify whether the info icon has its own click handler
3. Add or fix the click handler to:
   - Call `event.stopPropagation()` to prevent navigation
   - Display the intended hint/tooltip content
4. Implement appropriate tooltip/popover UI for hint display

## Acceptance Criteria

- [ ] Clicking the info icon displays hint text (not navigates to session)
- [ ] Clicking anywhere else on the session row still navigates to the session
- [ ] Tooltip/hint dismisses appropriately (click outside, escape key, or timer)
- [ ] Works on desktop browsers (Chrome, Firefox, Safari)

---

## Comments

### @MattStarfield on 2026-01-07T20:41:16Z

## Related Issue

This bug was discovered after implementing #3 (UX: Improve discoverability of session management).

The info icon was added as part of #3's acceptance criteria, but the click handling doesn't work correctly on desktop - clicking the icon navigates to the session instead of opening the action menu.

**Code Location:** `web/src/components/SessionList.tsx:338-349`

The implementation does call `stopPropagation()` and `preventDefault()`, so the bug may be related to:
- Touch event handling from the swipe gesture interfering
- Event ordering issues
- Browser-specific behavior

---

### @MattStarfield on 2026-01-08T00:01:37Z

## Issue Resolved - Final Summary

### Problem
Clicking the info icon (circle "i") in the session list navigated to the session instead of opening the Session Actions menu.

### Solution
Added event propagation stoppers (`stopPropagation()`) to the info button's `onMouseDown`, `onMouseUp`, `onTouchStart`, and `onTouchEnd` handlers. This prevents the `useLongPress` hook's handlers on the parent element from intercepting the click and triggering navigation.

### Files Modified
- `web/src/components/SessionList.tsx:340-343` - Added 4 event propagation stoppers to info button

### Verification
- [x] Typecheck passed
- [x] Build successful (included in typecheck)
- [x] Playwright desktop verification (confirmed by user)
- [x] Playwright mobile verification (N/A - desktop-only bug report)
- [x] Manual user testing completed
- [x] Code review passed
- [x] Direct commit to main (e0f5fcc)

### Deployment Notes
Standard deployment - no special considerations required.

---
*Closed by issue-closer agent*

---

