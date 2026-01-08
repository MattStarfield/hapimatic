# Issue #2: Add mint green header bar and border for PWA brand identity

| Field | Value |
|-------|-------|
| **State** | CLOSED |
| **Created** | 2026-01-05T22:16:24Z |
| **Closed** | 2026-01-05T23:27:24Z |
| **Author** | @MattStarfield |
| **Labels** | enhancement, pwa, ui |

---

## Description

## Summary

Add a mint green header bar displaying "HAPImatic" text and a mint green border around the app content area to establish clear visual brand identity for the PWA.

## Context

Users need to quickly identify when they are using the HAPImatic PWA versus other apps or the original HAPI. A consistent branded header and border will provide immediate visual recognition.

## Desired Outcome

### Header Bar
- Mint green background (`#5ae6ab` - project primary color)
- "HAPImatic" text in white
- Positioned below the iOS status bar safe area, above the current session header
- Visible on all screens/routes (session list, active session, etc.)

### Border
- Mint green (`#5ae6ab`) border around the entire app content area
- Applies to left, right, and bottom edges
- Thin/subtle but visible (exact thickness TBD during implementation)
- Must respect safe areas on iOS devices

## Implementation Path

1. Create a new branded header component or modify the root layout
2. Add border styling to the main app container
3. Ensure proper safe area handling for iOS devices
4. Test across session list view and active session view

## Affected Components

- [ ] `web/src/` - React components (likely App.tsx or layout components)
- [ ] Root layout/container styling
- [ ] CSS/Tailwind styling for header and border
- [ ] Possibly `web/index.html` for any root-level styling

## Acceptance Criteria

- [ ] Mint green header bar (`#5ae6ab`) displays "HAPImatic" in white text
- [ ] Header appears on all routes/screens within the PWA
- [ ] Header respects iOS status bar safe area (does not overlap)
- [ ] Mint green border visible on left, right, and bottom edges
- [ ] Border respects device safe areas (especially bottom on iOS)
- [ ] Border does not interfere with touch targets or scrolling
- [ ] Styling integrates with existing theme colors
- [ ] Works correctly in both light and dark system themes

## Risk Assessment

- **Safe area handling**: Must carefully test on iOS devices to ensure no overlap with system UI
- **Touch targets**: Border must not reduce usable tap area, especially near edges
- **Performance**: Additional DOM elements/styling should have minimal impact

## Server Restart Required

No - This is a frontend-only change that can be tested in dev mode.

## Reference Screenshot

The screenshot below shows approximate header and border placement (green highlighter markup indicates intended areas - dimensions are rough/approximate).

---

## Comments

### @MattStarfield on 2026-01-05T22:16:35Z

**Reference Screenshot**: See `/mnt/netshare/img/app-header-and-border.png` for the mockup showing approximate header and border placement (green highlighter markup indicates intended areas).

---

### @MattStarfield on 2026-01-05T23:28:23Z

## Issue Resolved - Final Summary

### Problem
Add branded visual frame to the HAPImatic PWA with mint green header showing "HAPImatic" text and mint green borders around the content area.

### Solution
Created a new `BrandedFrame` component that provides:
- **Mint green header bar** (`#5ae6ab`) with "HAPImatic" text in white at the top
- **Thin mint green borders** on left/right (4px) and bottom (8px to accommodate rounded corners)
- **Content area with rounded-2xl corners** to match iPhone screen shape
- **Proper iOS safe-area handling** for both top (header) and bottom (below content)

### Files Modified
- `web/src/components/BrandedFrame.tsx` - New component providing the branded wrapper
- `web/src/App.tsx` - Integrated BrandedFrame as root wrapper
- `web/src/components/ChatView.tsx` - Removed redundant safe-area padding (now centralized)
- `web/src/components/InstallPrompt.tsx` - Removed redundant safe-area padding
- `web/src/components/LoginPrompt.tsx` - Removed redundant safe-area padding
- `web/src/components/MessageList.tsx` - Removed redundant padding
- `web/src/components/PasswordPrompt.tsx` - Removed redundant safe-area padding
- `web/src/components/Composer.tsx` - Reduced padding for more vertical chat space
- `CLAUDE.md` - Added Playwright verification requirement before user testing

### Verification
- [x] Typecheck passed
- [x] Build successful
- [x] Playwright desktop verification completed
- [x] Playwright mobile (iPhone 14 Pro) verification completed
- [x] Manual user testing completed
- [x] Code review passed
- [x] Direct commit to main (c448047)

### Deployment Notes
Standard deployment - binary rebuild and service restart required to see changes in production.

---
*Closed by issue-closer agent*

---

