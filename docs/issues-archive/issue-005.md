# Issue #5: Tilde (~) in directory paths not expanded to home directory when spawning sessions

| Field | Value |
|-------|-------|
| **State** | CLOSED |
| **Created** | 2026-01-06T16:29:41Z |
| **Closed** | 2026-01-07T00:38:44Z |
| **Author** | @MattStarfield |
| **Labels** | bug |

---

## Description

## Summary

When a user enters `~/projects/hapimatic` as the directory path when creating a new session, the tilde (`~`) is not expanded to the user's home directory. Instead, it's treated as a literal directory name, causing the session to be created in the wrong location.

## Evidence

A literal `~` directory was created at `/mnt/docker/genai-playground-dev/~/projects/hapimatic/` (empty directories) instead of using `/home/matt/projects/hapimatic`.

Directory structure found:
```
/mnt/docker/genai-playground-dev/~/projects/hapimatic/  (empty)
```

Created at `Jan 6 10:55` when attempting to spawn a session with `~/projects/hapimatic` as the path.

## Root Cause Analysis

The directory path flows through the system without tilde expansion:

1. **Web UI** (`web/src/components/NewSession/DirectorySection.tsx`) - user types `~/projects/hapimatic`
2. **API Client** (`web/src/api/client.ts:spawnSession`) - sends directory as-is to server
3. **Server route** (`server/src/web/routes/machines.ts`) - validates non-empty string, passes to syncEngine
4. **RPC Gateway** (`server/src/sync/rpcGateway.ts`) - sends to daemon via `spawn-happy-session` RPC
5. **Daemon** (`cli/src/daemon/run.ts:spawnSession`) - uses directory directly with `fs.access()` and as `cwd`

The `~` is never expanded to the home directory at any point in this flow.

## Affected Code Locations

### Primary fix location: `cli/src/daemon/run.ts`

In the `spawnSession` function (around line 175-178):
```typescript
const { directory, sessionId, machineId, approvedNewDirectoryCreation = true } = options;
```
The `directory` variable is used directly without expansion.

### Secondary fix location: `cli/src/api/apiMachine.ts`

In the `path-exists` RPC handler (lines 81-98), paths are checked without tilde expansion:
```typescript
this.rpcHandlerManager.registerHandler<PathExistsRequest, PathExistsResponse>('path-exists', async (params) => {
    // ... paths used directly with fs.stat()
});
```

## Proposed Fix

Add tilde expansion before using the directory path. In `cli/src/daemon/run.ts`:

```typescript
import os from 'os';  // already imported

// In spawnSession function, after extracting directory:
const expandedDirectory = directory.startsWith('~') 
  ? directory.replace(/^~/, os.homedir())
  : directory;
```

Then use `expandedDirectory` instead of `directory` throughout the function.

Apply the same pattern in `apiMachine.ts` for the `path-exists` handler.

## Impact

- Users cannot spawn sessions using `~` shorthand for home directory
- Literal `~` directories may be created in unexpected locations
- Confusing behavior when paths appear to work but point to wrong locations

## Acceptance Criteria

- [ ] `~/projects/foo` resolves to `/home/<user>/projects/foo`
- [ ] `~user/projects/foo` is handled appropriately (either expanded or rejected with clear error)
- [ ] Path existence checks (`path-exists` RPC) correctly validate tilde paths
- [ ] No regression in absolute path handling

---

## Comments

### @MattStarfield on 2026-01-07T00:38:54Z

## Issue Resolved - Final Summary

### Problem
Directory paths containing tilde (`~`) were not expanded to the user's home directory when spawning sessions via the web UI, causing session spawn failures or creation of literal `~` directories.

### Solution
Added tilde expansion in two locations:
1. **Daemon session spawner** - Expands `~` before directory access/creation
2. **Path-exists RPC handler** - Expands `~` before checking if path exists (for UI validation)

### Files Modified
- `cli/src/daemon/run.ts:175-186` - Added tilde expansion after extracting directory from options
- `cli/src/api/apiMachine.ts:82-108` - Added `expandTilde()` helper in path-exists RPC handler

### Verification
- [x] Typecheck passed
- [x] Build successful
- [x] Playwright desktop verification
- [x] Manual user testing completed
- [x] Code review passed
- [x] Direct commit to main (e3e2fba)

### Deployment Notes
Standard deployment - binary has been rebuilt and is ready for deployment when user is ready.

---
*Closed by issue-closer agent*

---

