# Issue #14: UI Branding & Color Palette Update

| Field | Value |
|-------|-------|
| **State** | CLOSED |
| **Created** | 2026-01-07T00:42:38Z |
| **Closed** | 2026-01-07T01:41:56Z |
| **Author** | @MattStarfield |
| **Labels** | enhancement, ui |

---

## Description

## Summary

Comprehensive UI branding update to establish a cohesive visual identity with an updated color palette, improved favicon/icon consistency, and enhanced visual hierarchy in the session list.

**Supersedes**: #7, #8, #9

## Context

HAPImatic currently uses mint green (#5ae6ab) as the primary brand color. This update introduces a complete color palette with complementary colors and applies them consistently across all UI elements:

- **Primary**: Mint (#5ae6ab) - existing, unchanged
- **Primary Dark**: Dark Teal (#008080) - new, for depth and contrast
- **Accent**: Grape (#6F2DA8) - new, for interactive elements and highlights

## Desired Outcome

A polished, cohesive brand identity with:
1. Consistent favicon and app icon
2. Clear visual hierarchy in the session list
3. A complete color palette applied throughout the UI

---

## Implementation Tasks

### Part 1: Favicon Update (from #7)

Update favicon files to match the app icon for consistent branding across all browser contexts.

**Files to update**:
- `web/public/favicon.ico`
- Multiple favicon sizes (16x16, 32x32, etc.)
- `web/public/apple-touch-icon-180x180.png`

**Acceptance Criteria**:
- [ ] Favicon updated to match current app icon design
- [ ] Multiple favicon sizes generated for different contexts
- [ ] Apple touch icon updated
- [ ] Favicon displays correctly across Chrome, Safari, Firefox

---

### Part 2: Session List Visual Hierarchy (from #8)

Apply dark teal background to expandable project rows to distinguish them from session rows.

**Files to update**:
- `web/src/components/SessionList.tsx` (or equivalent)

**Visual Hierarchy**:
- **Project rows** (expandable): Dark teal (#008080) background
- **Session rows** (children): Maintain current styling

**Acceptance Criteria**:
- [ ] Project rows have dark teal (#008080) background color
- [ ] Session rows remain visually distinct from project rows
- [ ] Text readable against dark teal (white or light text)
- [ ] Hover state visible against new background
- [ ] Selected/active state works appropriately
- [ ] Visual hierarchy clear in both expanded and collapsed states

---

### Part 3: Color Palette & Text Outlines (from #9)

Establish CSS color variables and apply dark teal text outlines to branding elements.

**Files to update**:
| File | Changes |
|------|---------|
| `web/src/index.css` | Add CSS custom properties for new colors |
| `web/tailwind.config.ts` | Extend Tailwind theme if needed |
| `web/public/icon.svg` | Add dark teal outline to white "H" text |
| `web/src/components/BrandedFrame.tsx` | Add dark teal text outline to "HAPImatic" heading |

**CSS Variables to add**:
```css
--color-primary: #5ae6ab;      /* mint - existing */
--color-primary-dark: #008080; /* dark teal - new */
--color-accent: #6F2DA8;       /* grape - new */
```

**Acceptance Criteria**:
- [ ] CSS custom properties include dark teal as primary dark variant
- [ ] CSS custom properties include grape as accent color
- [ ] Light and dark mode variants properly defined
- [ ] App icon has visible dark teal outline on white text
- [ ] Site heading "HAPImatic" has dark teal text outline
- [ ] Interactive elements use grape accent appropriately
- [ ] Icons regenerated with updated design

---

## Technical Notes

### Text Outline Implementation

For the "HAPImatic" heading text outline:
```css
/* Webkit approach */
-webkit-text-stroke: 1px #008080;

/* Cross-browser fallback: duplicate text with stroke */
```

### Current BrandedFrame.tsx Reference
```tsx
<div className="h-full flex flex-col bg-[#5ae6ab]">
    <span className="text-white font-semibold text-sm tracking-wide">
        HAPImatic
    </span>
</div>
```

---

## Risk Assessment

- **Breaking Changes**: None - additive styling changes
- **Dependencies**: None - pure frontend/design work
- **Testing Required**: Visual verification across browsers, PWA icon appearance, light/dark modes

## Server Restart Required

Yes - After icon regeneration and component updates, a rebuild and deploy will require server restart, which will disconnect active HAPI sessions.

---

## Original Issues

This issue consolidates and supersedes:
- #7 - Update favicon to match app icon for consistent branding
- #8 - UI: Add dark teal background to expandable project rows in session list
- #9 - Update UI color palette with dark teal variant and grape accent

---

## Comments

### @MattStarfield on 2026-01-07T01:10:32Z

## Additional Changes Implemented

Based on user feedback, the following refinements were made beyond the original scope:

### 1. Purple Accent Color Integration

The grape accent color (#6F2DA8) is now used throughout the UI:
- **Header border**: Purple bottom border under "HAPImatic" heading
- **Session list borders**: Purple border under project group rows
- **Login screen**: Purple focus ring on input, purple button hover state
- **CSS variants added**:
  ```css
  --color-accent-light: rgba(111, 45, 168, 0.2);
  --color-accent-border: rgba(111, 45, 168, 0.4);
  --color-accent-glow: rgba(111, 45, 168, 0.6);
  ```

### 2. Header Text Refinements

- **Larger font size**: `text-xl` (up from `text-sm`)
- **Bold weight**: `font-bold`
- **Clean purple stroke**: 4px purple outline using `paint-order: stroke fill` to prevent stroke overlap
- **No glow/shadow**: Removed text-shadow for cleaner appearance

### 3. App Icon Enhancements

- **Gradient background**: Diagonal gradient from mint green (#5ae6ab) to grape purple (#6F2DA8)
- **Thicker purple stroke**: 5px on "HAPI", 4px on "matic"
- All PWA icons regenerated (64x64, 192x192, 512x512, maskable, apple-touch-icon)
- Favicon regenerated with gradient

### 4. Dark Teal Color Update

- **Changed from**: #008080
- **Changed to**: #014d4e (darker for better contrast)

### Files Modified

| File | Changes |
|------|---------|
| `web/src/index.css` | Updated dark teal, added accent variants |
| `web/src/components/BrandedFrame.tsx` | Larger header, clean purple stroke, border |
| `web/src/components/SessionList.tsx` | Purple borders on project rows |
| `web/src/components/LoginPrompt.tsx` | Purple accents on inputs/buttons |
| `web/public/icon-source.svg` | Gradient background, thicker purple stroke |
| `web/public/*.png` | All icons regenerated |
| `web/public/favicon.ico` | Regenerated with gradient |

### Testing Completed

- ✅ Desktop view verified with Playwright
- ✅ Mobile view (402x874) verified
- ✅ New gradient app icon verified
- ✅ Purple accents visible throughout UI

---

### @MattStarfield on 2026-01-07T01:27:18Z

## Additional Refinements - Rounded Font Implementation

Based on user feedback that the stroke-based rounding wasn't visible enough on iOS, implemented a proper rounded font solution:

### Changes Made (commit 8248894)

**Font Change:**
- Added **Varela Round** Google Font with naturally rounded letterforms
- Font loaded via preconnect for optimal performance
- Applied to both header bar and login screen HAPImatic text

**SVG Text Rendering:**
- Switched from CSS `-webkit-text-stroke` to SVG `<text>` elements
- This provides proper `strokeLinejoin="round"` and `strokeLinecap="round"` support
- Stroke width reduced to **3px** as requested

**Technical Implementation:**
```tsx
<svg viewBox="0 0 200 40" className="h-7 mx-auto">
    <text
        fontFamily="'Varela Round', system-ui, sans-serif"
        fontWeight="normal"
        fontSize="28"
        letterSpacing="2"
        fill="white"
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        paintOrder="stroke fill"
    >
        HAPImatic
    </text>
</svg>
```

**Why Varela Round:**
- Specifically designed with rounded terminals and smooth curves
- The stroke naturally follows the rounded contours of the letters
- Web-safe via Google Fonts with good cross-platform support

### Files Modified
- `web/index.html` - Added Google Fonts preconnect and Varela Round import
- `web/src/components/BrandedFrame.tsx` - SVG text with rounded font
- `web/src/components/LoginPrompt.tsx` - Matching SVG text styling

### Verification
- Verified with Playwright that both header and login screen display correctly
- Screenshot shows rounded letterforms with 3px purple stroke

Awaiting user approval on iOS device.

---

### @MattStarfield on 2026-01-07T01:41:32Z

## Closing Summary - Issue #14 Complete

### All Implementation Tasks Completed

**Part 1: Favicon Update** ✅
- Updated all favicon and PWA icon files
- Generated gradient background (mint green → grape purple)
- Apple touch icon updated

**Part 2: Session List Visual Hierarchy** ✅
- Project rows have dark teal (#014d4e) background
- Purple accent borders for visual definition
- Clear distinction between project and session rows

**Part 3: Color Palette & Text Styling** ✅
- CSS custom properties added for brand colors
- Dark teal updated to #014d4e
- Grape accent (#6F2DA8) applied throughout
- **Varela Round** Google Font for rounded letterforms
- SVG text rendering with 3px purple stroke
- Matching header and login screen styling

### Files Modified
- `web/index.html` - Google Fonts import
- `web/src/index.css` - Brand color CSS variables
- `web/src/components/BrandedFrame.tsx` - SVG header text
- `web/src/components/LoginPrompt.tsx` - SVG login text
- `web/src/components/SessionList.tsx` - Purple accent borders
- `web/public/icon-source.svg` - Gradient app icon
- All PWA icon PNG files regenerated

### Commits
- `c448047` - Initial branded frame with header
- `8248894` - Rounded font and refined branding
- `4e42409` - Added deployment verification checklist

### Deployment Verification
- Binary: 128,133,987 bytes ✓
- Assets: `index-BNiNERW7.js`, `index-Cn1T6KUA.css` ✓
- Visually verified via Playwright

Issue ready to close.

---

### @MattStarfield on 2026-01-07T01:41:56Z

Issue resolved. All three parts of the UI branding update have been successfully implemented and deployed:

- Part 1: Favicon and PWA icons with gradient background
- Part 2: Session list visual hierarchy with dark teal project rows  
- Part 3: Varela Round font, CSS color variables, and SVG text with purple stroke

Superseded issues #7, #8, and #9 are now covered by this implementation.

---
*Closed by issue-closer agent*

---

