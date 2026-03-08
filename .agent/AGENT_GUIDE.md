# Purriosity Agent Guide

## Goal
Use specialized skills to keep delivery fast, safe, and consistent across frontend, backend, content, QA, and deployment.

## Recommended Execution Order
1. `project-manager`: define scope, dependencies, acceptance criteria.
2. `backend` and/or `frontend`: implement changes in dependency order.
3. `content`: finalize user-facing copy and taxonomy.
4. `qa`: validate core flows and classify risks.
5. `devops`: deploy with monitoring and rollback readiness.

## Core Rules
- Prefer small, reviewable increments.
- Keep API/data contracts explicit before UI integration.
- Require lint/type/build passing before merge.
- Treat RLS and data integrity as mandatory checks for schema changes.
- Ship only with a clear QA recommendation (`GO`, `GO WITH RISKS`, `NO-GO`).

## Skill Index
See `.agent/skills/README.md` and each skill's `SKILL.md` for detailed workflow.
