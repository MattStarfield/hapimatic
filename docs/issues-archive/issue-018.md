# Issue #18: Feature: Semantic Versioning with Test Version Identifiers (A-Z)

| Field | Value |
|-------|-------|
| **State** | CLOSED |
| **Created** | 2026-01-07T20:29:43Z |
| **Closed** | 2026-01-07T23:33:49Z |
| **Author** | @MattStarfield |
| **Labels** | enhancement, pwa |

---

## Description

## Summary

Implement comprehensive semantic versioning for HAPImatic, including a visible version display in the PWA, integration with the build workflow, and test version identifiers (A-Z) for iterative issue development.

## Context

Currently HAPImatic has no version tracking system. This makes it impossible for users to:
- Confirm that a page refresh loaded the latest code
- Know which version they're running when reporting issues
- Verify that test changes have been deployed during issue iteration

This issue consolidates two proven versioning concepts from genai-playground ([#259](https://github.com/MattStarfield/genai-playground/issues/259) and [#286](https://github.com/MattStarfield/genai-playground/issues/286)) into a single comprehensive implementation for HAPImatic.

## Desired Outcome

### For Users
- See current version number in the PWA interface
- Confirm updates have propagated after refreshing
- Quickly identify which version is running when debugging

### For Development Workflow
- Automatic version bumps when completing issues
- Consistent MAJOR.MINOR.PATCH semantics
- Test version identifiers (A-Z) during iterative development to avoid version inflation

## Implementation Path

### Phase 1: Version Infrastructure

**1.1 Add version to package.json**

The root `package.json` currently has no version field. Add:
```json
{
  "name": "hapi",
  "version": "1.0.0",
  ...
}
```

**1.2 Create version utility in shared workspace**

Create `shared/src/version.ts`:
```typescript
export interface VersionInfo {
  version: string;
  updated: string;
}
```

**1.3 Expose version via server API**

Add endpoint in server workspace that reads from root package.json:
```typescript
// GET /api/version
// Returns: { "version": "1.0.0", "updated": "2025-01-07T..." }
```

### Phase 2: PWA Version Display

**2.1 Fetch and display version in web UI**

Display version in the PWA header (near HAPImatic branding):
- Small, subtle text (e.g., `text-xs text-slate-400`)
- Format: `v1.0.0` or `v1.0.0-B` during testing
- Update on app load/refresh

**2.2 Location options** (to be determined during implementation):
- Below "HAPImatic" title in header
- In settings/info modal
- Footer of main interface

### Phase 3: Build Workflow Integration

**3.1 Version bump script**

Create a script that can be run during build or manually:
```bash
# Usage: bun run version:bump [patch|minor|major]
```

**3.2 Build output version tracking**

The `bun run build:single-exe` workflow should:
1. Read current version from package.json
2. Include version in the built binary (accessible at runtime)
3. Optionally log the version being built

### Phase 4: Test Version Identifiers (A-Z)

**4.1 Test identifier scheme**

During iterative issue development:
```
First test deployment:   1.0.0   →  1.0.0-A
Second iteration:        1.0.0-A →  1.0.0-B
Third iteration:         1.0.0-B →  1.0.0-C
...
After Z (rare):          1.0.0-Z →  1.0.0-A (cycles)
```

**4.2 Final version on approval**
```
Test version:      1.0.0-C
                      ↓
Final version:     1.0.1  (test identifier stripped, real version bumped)
```

**4.3 Version bump rules by issue type**

| Issue Type | Bump | Example |
|------------|------|---------|
| Bug fix | PATCH | 1.0.0 → 1.0.1 |
| Enhancement | MINOR | 1.0.0 → 1.1.0 |
| Breaking change | MAJOR | 1.0.0 → 2.0.0 |

### Phase 5: Documentation

**5.1 Update CLAUDE.md**

Add versioning section with:
- Current version location
- When to bump versions (MAJOR/MINOR/PATCH guidelines)
- Test identifier workflow
- Version bump command reference

**5.2 Update agent templates** (if applicable)

- Issue-worker: Add/increment test identifier during testing
- Issue-closer: Strip identifier and bump real version on approval

## Affected Components

- [ ] `package.json` (root) - Add version field
- [ ] `shared/` - Version type definitions
- [ ] `server/` - Version API endpoint
- [ ] `web/` - Version display component
- [ ] `cli/` - Build workflow integration
- [ ] `CLAUDE.md` - Versioning documentation
- [ ] `.claude/agents/` - Agent workflow updates (if agents exist)

## Acceptance Criteria

### Version Display
- [ ] Version number visible in PWA interface
- [ ] Version updates correctly after deployment and page refresh
- [ ] Version format shows "v1.0.0" (with "v" prefix)
- [ ] Test versions display as "v1.0.0-A" format

### Backend
- [ ] `GET /api/version` endpoint returns current version
- [ ] Endpoint accessible from PWA client

### Build Workflow
- [ ] Version included in built binary
- [ ] Version bump script available (`bun run version:bump`)
- [ ] Build logs show version being compiled

### Test Identifier System
- [ ] Test identifier increments correctly (A→B→C...)
- [ ] Base version stays frozen during test iterations
- [ ] Final approval strips identifier and bumps real version

### Documentation
- [ ] CLAUDE.md contains versioning rules
- [ ] MAJOR/MINOR/PATCH guidelines documented
- [ ] Test identifier workflow documented

## Risk Assessment

**Breaking Changes:** None - purely additive feature

**Dependencies:** None - uses existing Bun/TypeScript patterns

**Testing Required:**
- Verify version displays correctly in PWA
- Verify version updates after build and deployment
- Verify test identifier increment logic
- Mobile viewport check - ensure version doesn't break layout

**Server Restart Required:** Yes - deployment of version endpoint and UI changes requires service restart (will disconnect active sessions)

## Technical Notes

### Why root package.json?
- Standard location for Node.js project versions
- Single source of truth across all workspaces
- Works with npm/bun version commands
- Already exists (just needs version field added)

### Bun workspace considerations
- Version should be readable from any workspace
- Build script in `cli/` needs access to root package.json
- Consider using workspace symlinks or relative paths

### PWA considerations
- Version fetch should happen on app initialization
- Cache the version to avoid repeated API calls
- Handle offline gracefully (show cached or "?.?.?")

## References

- genai-playground #259: Semantic Versioning Display
- genai-playground #286: Test Version Identifier (A-Z) for Issue-Worker Iterations

---

## Comments

### @MattStarfield on 2026-01-07T21:39:35Z

I'd like to add a comment that I want the version number and date stamp to be located at the very bottom of the black user interface panel, underneath the text input area and user interface buttons, there's a section under there with some unused black vertical space that we can utilize to include the version number and date stamp of that version number.

---

### @MattStarfield on 2026-01-07T23:34:16Z

## Issue Resolved - Final Summary

### Problem
Need a way to track which version of HAPImatic is deployed and display it in the PWA for debugging and verification purposes.

### Solution
Implemented semantic versioning infrastructure with test identifiers (A-Z) for iterative development. Version is now displayed in the BrandedFrame footer area on all pages.

### Files Modified
- `package.json` - Added version (1.0.0-B), versionTimestamp, and version bump scripts
- `server/src/web/routes/version.ts` - New `/api/version` endpoint (no auth required)
- `server/src/version.generated.ts` - Build-time generated version constants
- `server/scripts/generate-version-info.ts` - Script to generate version file during build
- `scripts/version-bump.ts` - CLI for version management (test, patch, minor, major, release)
- `web/src/hooks/useVersion.ts` - React Query hook to fetch version from API
- `web/src/components/BrandedFrame.tsx` - Added version display in footer
- `server/src/web/server.ts` - Mount version route before auth middleware
- `CLAUDE.md` - Added versioning documentation and workflow guide

### Verification
- [x] Typecheck passed
- [x] Build successful
- [x] Manual user testing completed (iOS device verification)
- [x] Code review passed
- [x] PR #20 merged to main

### Deployment Notes
Standard deployment. Version shows as: `v1.0.0-B • 1/7/2026 • 6:05 PM` (white text in mint green footer area)

---
*Closed by issue-closer agent*

---

