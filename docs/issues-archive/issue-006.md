# Issue #6: URLs in chat interface should open in new browser tabs

| Field | Value |
|-------|-------|
| **State** | CLOSED |
| **Created** | 2026-01-06T16:39:52Z |
| **Closed** | 2026-01-07T20:05:11Z |
| **Author** | @MattStarfield |
| **Labels** | enhancement, ui |

---

## Description

## Summary

All clickable URLs displayed in the chat interface should open in a new browser tab by default to prevent users from navigating away from their active HAPI session.

## Current Behavior

URLs in chat messages may open in the same tab, navigating away from the HAPI session.

## Desired Behavior

Any clickable URL rendered in the chat interface should:
- Have `target="_blank"` attribute
- Include `rel="noopener noreferrer"` for security
- Open in a new browser tab when clicked

## Rationale

- Users should not lose their place in an active chat session when clicking links
- Opening links in new tabs is the expected behavior for web applications with persistent state
- Prevents accidental navigation away from important ongoing work

## Acceptance Criteria

- [ ] All URLs in chat messages open in new tabs
- [ ] URLs in assistant responses open in new tabs
- [ ] URLs in code blocks (if clickable) open in new tabs
- [ ] Security attributes (`rel="noopener noreferrer"`) included
- [ ] Works consistently across all message types

---

## Comments

