---
name: project-manager
description: Use when a request spans multiple domains (frontend, backend, QA, DevOps, content), needs prioritization, or requires an execution plan with dependencies, quality gates, and rollout coordination.
---

# Project Manager Skill

## Purpose
Drive multi-skill delivery from request to release with clear sequencing, risk control, and measurable quality gates.

## Use This Skill When
- A feature touches more than one skill area.
- Prioritization or scope control is needed.
- A release decision depends on validation results.

## Required Inputs
- User goal and success criteria.
- Constraints: deadline, risk tolerance, environment (dev/staging/prod).
- Affected areas: UI, data model, API, content, deployment.

## Workflow
1. Define scope in one sentence and list explicit non-goals.
2. Break work into tracks: `frontend`, `backend`, `qa`, `devops`, `content`.
3. Identify dependencies and execution order.
4. Set priority:
   - `P0`: outage/data-loss/security
   - `P1`: core journey broken
   - `P2`: important enhancement
   - `P3`: polish
5. Assign acceptance criteria per track.
6. Execute track-by-track and re-plan if blockers appear.
7. Run release checklist and provide go/no-go recommendation.

## Quality Gates (Before Merge/Deploy)
- `npm run lint` passes.
- `npm run type-check` passes.
- `npm run build` passes.
- Critical user flows validated (manual or automated).
- DB/security changes reviewed for privilege and data integrity impact.
- Rollback path documented for risky changes.

## Output Contract
Return a concise status update with:
- Scope delivered.
- Open risks and mitigations.
- Validation evidence.
- Next recommended action.

## Handoff Rules
- To `backend`: include schema/API contract and edge cases.
- To `frontend`: include exact response shape, states, and UX behavior.
- To `qa`: include priority flows and expected results.
- To `devops`: include env vars, migration order, and rollback plan.
- To `content`: include voice, SEO target, and publishing constraints.

## References
- For templates and release playbooks, use `references/execution-playbook.md`.
