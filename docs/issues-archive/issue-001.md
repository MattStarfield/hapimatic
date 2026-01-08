# Issue #1: Bottom UI controls cut off by home indicator on iPhone PWA

| Field | Value |
|-------|-------|
| **State** | CLOSED |
| **Created** | 2026-01-05T21:47:31Z |
| **Closed** | 2026-01-05T22:06:02Z |
| **Author** | @MattStarfield |
| **Labels** | bug, pwa, ui |

---

## Description

## Summary

When running HAPImatic as a fullscreen PWA on iPhone (Face ID models), the bottom UI controls are cut off by the home indicator safe area. The settings gear, stop button, device button, send arrow, and text input field are partially obscured.

## Screenshot

![hapimatic-bottom-cut-off](https://github.com/user-attachments/assets/placeholder)

## Device Information

- **Device**: iPhone 16 Pro
- **Mode**: Installed PWA (standalone/fullscreen)
- **Issue**: Bottom safe area not respected

## Current Behavior

The bottom composer area with controls (settings, stop, device, send buttons) extends to the very edge of the screen and is partially hidden behind the iOS home indicator gesture bar.

## Root Cause Analysis

The viewport meta tag correctly includes `viewport-fit=cover`, and top safe areas are properly handled throughout the app using `pt-[env(safe-area-inset-top)]`. However, in `web/src/components/AssistantChat/HappyComposer.tsx` (line 117):

```typescript
const bottomPaddingClass = isIOSPWA ? 'pb-0' : 'pb-3'
```

This logic **removes** bottom padding when iOS PWA is detected, when it should actually **add** safe area inset padding. The intent appears to have been to avoid double-padding, but the result is no safe area accommodation at all.

## Affected Components

- [x] `web/` - PWA frontend
- [x] `web/src/components/AssistantChat/HappyComposer.tsx` - Primary fix location

## Implementation Path

1. Update `HappyComposer.tsx` to use `env(safe-area-inset-bottom)` for iOS PWA bottom padding:
   ```typescript
   // Instead of removing padding, add safe area padding
   const bottomPaddingClass = isIOSPWA 
     ? 'pb-[env(safe-area-inset-bottom)]' 
     : 'pb-3'
   ```

2. Alternatively, apply safe area padding to the outer container in `index.css` or the root layout component.

3. Test on iOS PWA to verify the fix, ensuring:
   - Bottom controls are fully visible above the home indicator
   - No excessive padding in non-PWA contexts
   - Keyboard behavior remains correct

## Acceptance Criteria

- [ ] Bottom toolbar (settings, stop, device, send buttons) fully visible on iPhone PWA
- [ ] Text input field not obscured by home indicator
- [ ] Fix does not negatively impact non-iOS or non-PWA contexts
- [ ] Tested on iPhone with Face ID (notch/Dynamic Island models)

## Server Restart Required

Yes - deploying the fix requires rebuilding and restarting the HAPImatic server, which will disconnect active sessions.

## References

- iOS Safe Area documentation: https://developer.apple.com/design/human-interface-guidelines/layout#Safe-areas
- CSS `env()` safe area insets: https://developer.mozilla.org/en-US/docs/Web/CSS/env

---

## Comments

### @MattStarfield on 2026-01-05T21:47:48Z

## Screenshot

**Note**: Please manually upload the screenshot from `/mnt/netshare/img/hapimatic-bottom-cut-off.png` to this issue via the GitHub web interface, or drag-and-drop the image file into the issue body.

The screenshot shows the bottom UI controls being cut off at the edge of the screen - the settings gear, stop button, device button, and send arrow are partially obscured by the iPhone home indicator area.

---

### @MattStarfield on 2026-01-05T22:06:18Z

## Issue Resolved - Final Summary

### Problem
iPhone PWA bottom toolbar (settings, stop, device, send buttons) was partially obscured by the iOS home indicator bar, making the UI difficult to use.

### Solution
Changed the bottom padding for iOS PWA from a static `pb-0` to a dynamic `pb-[env(safe-area-inset-bottom)]` which uses the CSS environment variable to automatically add the correct padding based on the device's safe area insets.

### Files Modified
- `web/src/components/AssistantChat/HappyComposer.tsx:117` - Changed bottom padding class from `pb-0` to `pb-[env(safe-area-inset-bottom)]` for iOS PWA detection
- `CLAUDE.md` - Updated deployment instructions with improved procedure including handling for "Text file busy" errors

### Verification
- [x] Typecheck passed
- [x] Build successful
- [x] Manual user testing completed on iPhone PWA
- [x] Code review passed
- [x] Direct commit to main (997842e)

### Deployment Notes
Standard deployment - binary was built and deployed prior to user testing. The fix uses native CSS environment variables supported by iOS Safari, no special deployment considerations.

---
*Closed by issue-closer agent*

---

