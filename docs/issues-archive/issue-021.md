# Issue #21: Desktop favicons don't match iOS app icon branding

| Field | Value |
|-------|-------|
| **State** | OPEN |
| **Created** | 2026-01-08T00:26:23Z |
| **Closed** | N/A |
| **Author** | @MattStarfield |
| **Labels** | pwa |

---

## Description

## Summary
Desktop browser favicons still display differently from the HAPImatic app icon shown on iOS, creating inconsistent branding across platforms.

## Details
- **Files**: `web/public/favicon.ico`, `web/public/icon.svg`, `web/public/mask-icon.svg`
- **Location**: Desktop browser tabs, bookmarks, and pinned tabs
- **Change**: Regenerate/update favicon files to match the HAPImatic app icon (mint-to-grape gradient with white "HAPI/matic" text and purple accents)

## Current Behavior
- iOS app icon displays the correct HAPImatic branding (mint green gradient, white text, purple accents)
- Desktop favicons in browser tabs appear different from the iOS app icon
- Brand inconsistency between mobile PWA and desktop browser contexts

## Desired Outcome
- Desktop favicons should visually match the iOS app icon
- Consistent HAPImatic branding across all platforms and contexts:
  - Browser tabs
  - Bookmarks
  - Browser history
  - Safari pinned tabs
  - Desktop PWA shortcuts

## Files to Update
- `web/public/favicon.ico` - Multi-size ICO (16x16, 32x32, 48x48)
- `web/public/icon.svg` - Vector icon for modern browsers
- `web/public/mask-icon.svg` - Safari pinned tab icon (monochrome)
- Reference: `web/public/icon-source.svg` - Source file with correct branding

## Theme Reference
- Primary: `#5ae6ab` (mint green)
- Accent: `#6F2DA8` (grape purple)
- Text: White with purple outline
- Background: Mint-to-grape gradient

## Acceptance Criteria
- [ ] Desktop favicon matches iOS app icon appearance
- [ ] Favicon displays correctly in Chrome, Safari, and Firefox tabs
- [ ] Safari pinned tab icon uses mint green color
- [ ] Bookmark icons match app branding

---

## Comments

