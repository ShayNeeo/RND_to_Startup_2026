# Agentic development

Applies to every coding agent (Grok, Claude, Codex, Cursor, Copilot, …).

## Load

1. Root [`AGENTS.md`](../AGENTS.md)
2. This file
3. The open CR in `changes/`, if any
4. Nearest nested `AGENTS.md` (none yet except root)

## Session start

1. `git status` and `git branch --show-current`. If you are on `stable` or `main`, stop and switch to a `feature/` or `cr/` branch from `dev`.
2. If the task is multi-person or multi-file: require a CR. If none exists, write one and stop for integrator ack on **MUST NOT TOUCH**.
3. One agent, one worktree, one branch. Never two agents in the same working tree.
4. Own only the paths in the CR ownership table.

## While coding

- Implement **MUST CHANGE**. Leave **MUST KEEP** alone.
- Shared files (`openapi.json`, lockfiles, `pnpm-workspace.yaml`) have one owner this CR. Others wait.
- `uv` for Python. `pnpm` / `bun` for JS. No `pip`, `npm install`, or `yarn`.
- Tests or build for the slice you touched before you claim done.
- Commits include `CR:`, `Task:`, `Worktree:` trailers.

## Done

1. Fill the CR **Agent completion** block (SHA, files, tests).
2. Open a PR to `dev` with the feature template.
3. Do not merge your own PR unless the CR names you as integrator.

## Parallel agents

| Do | How |
|----|-----|
| Isolate | `git worktree add .worktrees/<id> -b cr/<nnn>-<scope> origin/dev` |
| Split files | [ownership.md](ownership.md) before launch |
| Merge | Sequential PRs into `dev`, not a mega-merge |
| Hotspots | One agent owns `openapi.json` / lockfiles this CR |

Sources: AGENTS.md standard (Agentic AI Foundation), git worktree isolation for concurrent agents, GitHub PR governance for agent-authored PRs.
