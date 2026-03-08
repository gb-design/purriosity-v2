---
name: qa
description: Use for validation of Purriosity features through functional, regression, accessibility, and performance checks, with clear bug reports and release readiness decisions.
---

# QA Skill

## Purpose
Verify changes are correct, stable, and releasable with evidence.

## Test Strategy
- Risk-first: cover critical journeys before edge polish.
- Prefer reproducible checks with explicit expected outcomes.
- Log failures with exact steps and environment.

## Core Flows
1. Discovery: list/grid to product detail.
2. Engagement: purr/save interactions.
3. Auth boundaries: anonymous vs authenticated behavior.
4. Outbound conversion: affiliate click/redirect behavior.
5. Admin/content paths (if changed).

## Workflow
1. Build test matrix from changed files.
2. Execute smoke tests on impacted flows.
3. Run accessibility checks for changed UI.
4. Validate responsive behavior on mobile + desktop widths.
5. Capture defects with severity and repro steps.

## Severity Model
- `P0`: data loss, security issue, complete outage.
- `P1`: core flow blocked.
- `P2`: degraded behavior with workaround.
- `P3`: cosmetic/minor friction.

## Release Recommendation
Return `GO`, `GO WITH RISKS`, or `NO-GO` with:
- failing checks
- risk level
- concrete follow-up actions

## References
- For report structure and defect logging format, use `references/test-report-template.md`.
