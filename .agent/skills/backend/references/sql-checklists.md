# Backend Reference

## Migration Safety Checklist
- [ ] Backward compatible where possible.
- [ ] Constraints reflect business rules.
- [ ] Indexes added for hot paths.
- [ ] RLS policies added/updated for exposed tables.
- [ ] Rollback strategy documented.

## SQL Review Template
```md
## Objects Changed
- tables:
- indexes:
- policies:
- functions:

## Risk Review
- data loss risk:
- lock/perf risk:
- auth/privilege risk:

## Validation
- expected query paths:
- policy behavior by role:
```
