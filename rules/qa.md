# QA / QC (`dev` → `stable`)

QA happens **on `dev`**, after feature CRs are merged, **before** the promotion PR.

## Who

A person or an agent that did **not** author the majority of the `dev` tip. Dual-role is allowed on a two-person team if they use the sign-off form.

## Gate

1. `git fetch` and check out `origin/dev`.
2. Run [forms/QA_SIGN_OFF.md](forms/QA_SIGN_OFF.md) checks.
3. File the filled form under `changes/QA-YYYYMMDD.md` (or attach in the promotion PR).
4. Open PR `dev` → `stable` with the stable template.
5. Merge only if CI is green and the sign-off is complete.

## Fail

If QA fails: open a `fix/` branch **from `dev`**, CR if multi-file, PR back to `dev`. Do not patch `stable` directly unless production is down (hotfix rule in [branching.md](branching.md)).
