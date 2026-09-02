---
schema: change-request/v1
cr_id: CR-YYYYMMDD-NNN
title: ""
status: draft   # draft | ready | in_progress | blocked | review | approved | merged | cancelled
priority: medium
risk: medium
base_branch: dev
created_at: YYYY-MM-DD
requester: ""
integrator: ""
---

# Change Request: `CR-YYYYMMDD-NNN`

> Integrator (human or AI): read **§1 then §3** before looking at the diff.

## 1. Outcome

**Objective** (one sentence):

**Why now:**

**Base:** `origin/dev` @ `<sha>`

## 2. Scope fence (fill this first)

### MUST KEEP

Behavior, files, or contracts that stay. Integrator **rejects** the PR if these move without an explicit exception below.

-
-

### MUST CHANGE

The only work this CR authorizes.

- [ ] **C-01:**
- [ ] **C-02:**
- [ ] **C-03:**

### MUST NOT TOUCH

Paths or topics. Any diff here is an automatic Changes Requested.

- `apps/landing/**` (example — delete if landing is in scope)
-
-

### Explicit exceptions

| Path | Allowed delta | Why |
|------|----------------|-----|
| | | |

## 3. Ownership

| Worktree | Owner | Type | Branch | Paths | Status |
|----------|-------|------|--------|-------|--------|
| WT-01 | | human/ai | `cr/NNN-` | | Planned |
| WT-02 | | human/ai | `cr/NNN-` | | Planned |

| Task | Description | Owner | WT | Depends | Status |
|------|-------------|-------|----|---------|--------|
| T-01 | | | WT-01 | — | Not Started |
| T-02 | | | WT-02 | T-01 | Not Started |

**Hotspots this CR (one owner):**

| Path | Owner |
|------|-------|
| `apps/api/openapi.json` | |
| lockfiles | |

## 4. Acceptance

- [ ] **AC-01:**
- [ ] **AC-02:** Existing tests/build for touched apps still pass.
- [ ] **AC-03:** No files outside MUST CHANGE / exceptions.

### Verify commands

```bash
# e.g. pnpm run build:landing
# e.g. cd apps/api && uv run pytest
```

## 5. Integrator checklist (merge to `dev`)

- [ ] Diff `origin/dev...HEAD` contains no **MUST NOT TOUCH** paths
- [ ] Every **MUST CHANGE** item is done or explicitly cut
- [ ] **MUST KEEP** still holds
- [ ] Verify commands ran (paste output summary)
- [ ] PR uses `feature-to-dev` template and links this file
- [ ] Decision: **approve** / **request changes** (cite CR lines)

Integrator notes:

## 6. Agent completion (each WT)

```yaml
cr_id: CR-YYYYMMDD-NNN
task_ids: [T-01]
worktree_id: WT-01
branch: cr/NNN-scope
base_sha: ""
final_sha: ""
files_changed: []
tests: [{ command: "", result: "" }]
unresolved_items: []
```

## 7. After merge

- [ ] CR moved to `changes/archive/`
- [ ] Worktrees removed
- [ ] PR URL:
