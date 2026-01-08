# Issue #8: UI: Add dark teal background to expandable project rows in session list

| Field | Value |
|-------|-------|
| **State** | CLOSED |
| **Created** | 2026-01-06T16:40:43Z |
| **Closed** | 2026-01-07T00:42:55Z |
| **Author** | @MattStarfield |
| **Labels** | enhancement, ui |

---

## Description

## Summary

Update the session list UI to make expandable project rows visually distinct from session rows by giving them a dark teal (#008080) background color, improving visual hierarchy and scannability.

## Context

Project rows and session rows in the session list currently have similar or identical styling, making it difficult to quickly distinguish between them when managing many projects and sessions.

Related to #3 (UX improvements for session list management) - This enhancement complements session management discoverability by improving visual organization.

## Desired Outcome

As a user managing multiple projects with several sessions each, I want expandable project rows to have a distinct background color, so that I can quickly identify project groupings at a glance.

### Visual Hierarchy
- **Project rows** (expandable): Dark teal (#008080) background
- **Session rows** (children): Maintain current styling (no change)

## Implementation Path

1. Locate the session list component (likely `web/src/components/SessionList.tsx` or similar)
2. Identify the conditional rendering that differentiates project rows from session rows
3. Apply dark teal (`#008080`) background color to project row elements
4. Adjust text color for readability against dark teal (white or light text recommended)
5. Update hover and selected states to work with new background
6. Test collapsed and expanded states

## Affected Components

- `web/src/components/` - Session list components (SessionList.tsx or equivalent)
- Styling for expandable project rows

## Acceptance Criteria

- [ ] Project rows have dark teal (#008080) background color
- [ ] Session rows (children of project rows) remain visually distinct from project rows
- [ ] Text remains readable against dark teal background (adjust text color if needed)
- [ ] Hover state works appropriately with new background (visible change on hover)
- [ ] Selected/active state works appropriately with new background
- [ ] Visual hierarchy is clear when list is expanded
- [ ] Visual hierarchy is clear when list is collapsed
- [ ] No regression in existing session list functionality

## Risk Assessment

**Breaking Changes**: None - This is a styling-only change
**Dependencies**: None
**Testing Required**: Visual testing across light/dark themes (if applicable), hover/selection states

## Color Reference

- **Dark teal**: `#008080` (CSS: `background-color: #008080` or Tailwind: `bg-[#008080]`)
- Recommended text color for contrast: white (`#FFFFFF`) or very light gray

## Server Restart Required

No - This is a frontend-only styling change.

---

## Comments

### @MattStarfield on 2026-01-07T00:42:47Z

Superseded by #14 (UI Branding & Color Palette Update), which consolidates this issue with #7 and #9 into a comprehensive branding update.

---

### @MattStarfield on 2026-01-07T00:42:54Z

Closing as superseded by #14

---

