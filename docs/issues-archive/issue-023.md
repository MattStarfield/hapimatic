# Issue #23: Change Enter key to insert newline instead of submitting message

| Field | Value |
|-------|-------|
| **State** | OPEN |
| **Created** | 2026-01-08T04:27:56Z |
| **Closed** | N/A |
| **Author** | @MattStarfield |
| **Labels** | enhancement, ui |

---

## Description

## Summary

Change the Enter/Return key behavior in the chat input from "submit message" to "insert newline", making the send button the only way to submit messages.

## Current Behavior

- Pressing Enter/Return submits the message immediately
- This is controlled by `submitOnEnter` prop on `ComposerPrimitive.Input` (line 480 of `HappyComposer.tsx`)
- Multi-line messages require using Shift+Enter

## Desired Behavior

- Pressing Enter/Return inserts a newline in the text input
- Messages are submitted ONLY by clicking the send arrow button
- No keyboard shortcut for submission (or optionally Ctrl+Enter as a power-user shortcut)

## Rationale

Allows natural multi-line message composition without accidental submission. Users can compose longer, formatted messages without worrying about premature sends.

## Implementation Path

1. Remove or set `submitOnEnter={false}` on `ComposerPrimitive.Input`
2. Verify Enter key inserts newline by default (may need to handle in `onKeyDown`)
3. Optionally add Ctrl+Enter as an alternative submit shortcut for power users

## Affected Components

- [ ] `web/src/components/AssistantChat/HappyComposer.tsx` - Input configuration and key handling

## Acceptance Criteria

- [ ] Pressing Enter inserts a newline in the input field
- [ ] Pressing Shift+Enter also inserts a newline (consistent behavior)
- [ ] Clicking the send button submits the message
- [ ] (Optional) Ctrl+Enter submits the message as a keyboard alternative
- [ ] Autocomplete selection with Enter still works when suggestions are visible

## Notes

The current `handleKeyDown` already intercepts Enter when autocomplete suggestions are visible (lines 238-243). This behavior should be preserved - Enter should only insert a newline when no autocomplete popup is active.

---

## Comments

