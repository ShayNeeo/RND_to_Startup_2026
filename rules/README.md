# Rules — humans and agents

Read this folder before writing code with another person or another agent.

| File | When |
|------|------|
| [branching.md](branching.md) | Creating a branch, opening a PR, promoting a release |
| [change-request.md](change-request.md) | Starting work that will merge **feature → `dev`** |
| [pull-request.md](pull-request.md) | Opening GitHub PRs (`feature → dev` or `dev → stable`) |
| [agentic.md](agentic.md) | Any AI coding agent session |
| [ownership.md](ownership.md) | Parallel work, file hotspots, CODEOWNERS |
| [qa.md](qa.md) | QA/QC on `dev` before promoting to `stable` |
| [forms/CHANGE_REQUEST.md](forms/CHANGE_REQUEST.md) | Copy into `changes/CR-YYYYMMDD-NNN.md` |
| [forms/PULL_REQUEST_FEATURE.md](forms/PULL_REQUEST_FEATURE.md) | Feature → `dev` (also `.github/PULL_REQUEST_TEMPLATE/feature-to-dev.md`) |
| [forms/PULL_REQUEST_STABLE.md](forms/PULL_REQUEST_STABLE.md) | `dev` → `stable` |
| [forms/QA_SIGN_OFF.md](forms/QA_SIGN_OFF.md) | QA gate on `dev` |

Filled CRs live in [`changes/`](../changes/). Merged CRs move to `changes/archive/`.
