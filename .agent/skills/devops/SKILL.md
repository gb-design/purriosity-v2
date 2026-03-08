---
name: devops
description: "Use for Purriosity build/release operations: CI/CD checks, environment configuration, deployment safety, monitoring, rollback planning, and production readiness."
---

# DevOps Skill

## Purpose
Ship safely with repeatable build/deploy workflows and clear rollback paths.

## Workflow
1. Confirm target environment (`dev`, `staging`, `prod`).
2. Validate build pipeline prerequisites.
3. Verify environment variables and secrets are present.
4. Run deployment and post-deploy health checks.
5. Monitor, then confirm release status.

## Pre-Deploy Gates
- `npm run lint`
- `npm run type-check`
- `npm run build`
- Migration order reviewed for backend changes.

## Deployment Rules
- Prefer staged rollout for risky changes.
- Record deployed version and timestamp.
- Keep rollback command/path ready before production deploy.

## Monitoring Baseline
- App availability and error rate.
- Frontend runtime errors.
- API/db latency anomalies.
- Failed auth and failed outbound redirects.

## Incident Handling
1. Classify impact (`P0-P3`).
2. Stabilize first (rollback or feature flag).
3. Communicate status and ETA.
4. Document root cause and preventive fix.

## Handoff
Provide:
- deploy result and environment
- observed metrics/issues
- rollback status or follow-up tasks

## References
- For deploy sequence and rollback notes, use `references/deploy-runbook.md`.
