# Issue #9: Update UI color palette with dark teal variant and grape accent

| Field | Value |
|-------|-------|
| **State** | CLOSED |
| **Created** | 2026-01-06T16:41:29Z |
| **Closed** | 2026-01-07T00:42:56Z |
| **Author** | @MattStarfield |
| **Labels** | enhancement, ui |

---

## Description

## Summary

Update the site's UI design color palette to incorporate new brand colors while maintaining the existing mint as the primary color. Add dark teal (#008080) as the darker variant and grape (#6F2DA8) as the accent color, plus add dark teal text outlines to the app icon and site heading for improved visibility.

## Context

The current color scheme uses mint green as the primary brand color (visible in the branded header frame). This enhancement adds complementary colors to create a more polished and cohesive brand identity:

- **Primary**: Mint (existing `#5ae6ab`) - keep as main brand color
- **Dark Variant**: Dark Teal (`#008080`) - darker variant of primary for depth and contrast
- **Accent**: Grape (`#6F2DA8`) - accent color for highlights and interactive elements

## Desired Outcome

A cohesive color palette that maintains mint as the primary identity while introducing dark teal for depth/contrast and grape for interactive accents. Text elements in the app icon and site heading should have improved visibility through dark teal outlines.

## Implementation Path

1. **Update CSS color variables** in `/web/src/index.css`:
   - Add `--primary-dark` variable for dark teal (#008080)
   - Update `--accent` to grape (#6F2DA8) or add dedicated `--accent-highlight` variable
   - Ensure both light and dark mode variants are defined

2. **Update Tailwind config** in `/web/tailwind.config.ts`:
   - Extend color theme with new brand colors if needed

3. **Update app icon** (`/web/public/icon.svg` and related assets):
   - Add thin dark teal (#008080) outline/stroke to white "H" text
   - Regenerate `apple-touch-icon-180x180.png` and `favicon.ico`

4. **Update site heading** in `/web/src/components/BrandedFrame.tsx`:
   - Add dark teal text outline/stroke to "HAPImatic" text (CSS `text-stroke` or SVG filter)

5. **Apply dark teal variant** throughout UI where darker primary shade is needed

6. **Apply grape accent** to interactive elements (buttons, links, highlights)

## Affected Components

| File | Purpose | Changes |
|------|---------|---------|
| `web/src/index.css` | CSS custom properties | Add new color variables |
| `web/tailwind.config.ts` | Tailwind theme | Extend colors if needed |
| `web/public/icon.svg` | App icon | Add dark teal text outline |
| `web/public/apple-touch-icon-180x180.png` | iOS icon | Regenerate with new design |
| `web/src/components/BrandedFrame.tsx` | Header component | Add text outline to heading |
| Various UI components | Interactive elements | Apply grape accent |

## Acceptance Criteria

- [ ] CSS custom properties include dark teal (`#008080`) as primary dark variant
- [ ] CSS custom properties include grape (`#6F2DA8`) as accent color
- [ ] Both light and dark mode variants properly defined
- [ ] App icon has visible dark teal outline on white text
- [ ] Site heading "HAPImatic" has dark teal text outline
- [ ] Interactive elements (buttons, links) use grape accent appropriately
- [ ] Visual consistency maintained across all UI elements
- [ ] Icons regenerated (apple-touch-icon, favicon)

## Risk Assessment

**Breaking Changes**: Low - additive color changes, existing mint primary unchanged
**Dependencies**: None - pure frontend/design changes
**Testing Required**: Visual verification across light/dark modes, mobile PWA icon appearance

## Technical Notes

Current color references in `BrandedFrame.tsx`:
```tsx
<div className="h-full flex flex-col bg-[#5ae6ab]">  // mint background
    <span className="text-white font-semibold text-sm tracking-wide">
        HAPImatic
    </span>
</div>
```

For text outline, consider:
- CSS `-webkit-text-stroke: 1px #008080;` for webkit browsers
- SVG filter approach for cross-browser support
- Duplicate text with stroke for fallback

---

## Comments

### @MattStarfield on 2026-01-07T00:42:48Z

Superseded by #14 (UI Branding & Color Palette Update), which consolidates this issue with #7 and #8 into a comprehensive branding update.

---

### @MattStarfield on 2026-01-07T00:42:56Z

Closing as superseded by #14

---

