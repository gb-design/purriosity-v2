# Purriosity Agent Skills

This directory contains the local skills used to execute work in this repository.

## Available Skills
- `project-manager`: cross-skill orchestration, prioritization, release decisions.
- `frontend`: React/Vite UI implementation and optimization.
- `backend`: Supabase/Postgres migrations, RLS, and data contracts.
- `content`: product/editorial copy, taxonomy, and SEO consistency.
- `qa`: test planning, defect reporting, and release recommendation.
- `devops`: CI/CD, deployment safety, monitoring, and rollback handling.
- `security-best-practices`: reference skill for explicit security reviews.

## Usage Pattern
1. Start with `project-manager` when work spans multiple domains.
2. Execute domain work in the relevant skill(s).
3. Run `qa` validation before release.
4. Use `devops` for deploy and post-deploy checks.

## Skill Metadata
- Every local skill now includes `agents/openai.yaml` for UI discovery/chips and default prompts.
- Deep guidance was moved to per-skill `references/` files to keep `SKILL.md` concise.

## Source Files
- `.agent/skills/project-manager/SKILL.md`
- `.agent/skills/frontend/SKILL.md`
- `.agent/skills/backend/SKILL.md`
- `.agent/skills/content/SKILL.md`
- `.agent/skills/qa/SKILL.md`
- `.agent/skills/devops/SKILL.md`
- `.agent/skills/security-best-practices/SKILL.md`
