---
name: backend
description: "Use for Supabase/Postgres backend work: schema changes, SQL migrations, RLS policies, data integrity, query performance, and API-facing contracts for Purriosity."
---

# Backend Skill

## Purpose
Deliver safe, reversible, and performant backend changes for Purriosity.

## Stack Guardrails
- Supabase Postgres as source of truth.
- SQL-first migrations.
- RLS enabled and explicitly reviewed on all exposed tables.

## Workflow
1. Read current schema/migration context before editing.
2. Define contract change: tables, columns, constraints, policies, indexes.
3. Write migration with safe ordering:
   - create/alter structures
   - backfill if needed
   - add constraints/indexes
   - update RLS policies
4. Validate query and policy impact.
5. Document rollback considerations.

## Migration Rules
- Never drop/rename destructive objects without explicit need and fallback.
- Prefer additive, backward-compatible migrations when possible.
- Index columns used in joins, filters, and sort paths.
- Keep policy logic minimal and testable.

## Security Rules
- Enforce least privilege in RLS.
- Distinguish authenticated user actions from admin-only paths.
- Avoid `SECURITY DEFINER` unless required; if used, scope tightly.

## Quality Checklist
- SQL is idempotent or safely re-runnable where practical.
- Constraints match business invariants.
- RLS behavior documented per role.
- Performance-sensitive queries reviewed with realistic predicates.

## Handoff
Provide:
- Migration intent and affected objects.
- API/shape changes for frontend.
- Test scenarios QA should execute.

## References
- For migration safety and SQL review templates, use `references/sql-checklists.md`.
