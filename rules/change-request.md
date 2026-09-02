# Change Request (CR)

A CR is the contract for **feature → `dev`**. Humans and agents read it before they touch files.

A GitHub PR is the merge vehicle. The CR is the instruction sheet: **what must stay, what must change, what must not be touched.**

## When

Create a CR **before** the first commit on a feature/`cr/*` branch when:

- more than one person **or** agent will edit
- the work spans more than one app (`apps/api`, `apps/mobile-driver`, `apps/landing`)
- shared types, OpenAPI, or lockfiles will move

Tiny single-file docs typos: skip CR, still open a PR to `dev`.

## Steps

1. Copy [`forms/CHANGE_REQUEST.md`](forms/CHANGE_REQUEST.md) to `changes/CR-YYYYMMDD-NNN.md`.
2. Fill **MUST KEEP / MUST CHANGE / MUST NOT TOUCH** first. Those three lists are the integrator's source of truth.
3. Assign one owner per path (see [ownership.md](ownership.md)).
4. One worktree + one `cr/<nnn>-<scope>` branch per owner, cut from `origin/dev`.
5. Implement only **MUST CHANGE**. Do not "improve" **MUST KEEP**.
6. Open a PR **into `dev`** using the feature template. Link the CR path.
7. Integrator (person or agent) re-reads the CR, diffs against **MUST KEEP / MUST NOT TOUCH**, then merges.
8. After merge: move the CR to `changes/archive/`, delete worktrees.

## Integrator (person or AI)

Before merging `feature → dev`:

1. Open the CR. Read sections 1–3 only first.
2. `git diff origin/dev...HEAD --stat` vs **MUST NOT TOUCH**. Any hit → reject.
3. Confirm every **MUST CHANGE** item has a commit or an explicit "cut" note.
4. Confirm **MUST KEEP** files are unchanged or only received the listed exception.
5. Run the verify commands in the CR.
6. Approve the PR or request changes with a pointer to the CR line.

## IDs

`CR-YYYYMMDD-NNN` — date of filing, not of merge. `NNN` is 001, 002, … that day.
