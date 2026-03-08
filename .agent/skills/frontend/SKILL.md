---
name: frontend
description: "Use for React/Vite UI work in Purriosity: components, routes, state handling, accessibility, responsive behavior, performance tuning, and integration with Supabase-backed APIs."
---

# Frontend Skill

## Purpose
Implement and refine the Purriosity web UI using the existing React + TypeScript + Vite stack.

## Stack Guardrails
- React 18 + TypeScript.
- Routing with `react-router-dom`.
- Styling consistent with existing Tailwind/utilities patterns.
- Keep changes aligned with current component architecture.

## Workflow
1. Locate affected route/component and existing patterns.
2. Define component/API contract before implementation.
3. Implement UI states explicitly: `loading`, `empty`, `error`, `success`.
4. Add/adjust interactions (purr/save/filter) with optimistic updates only when rollback is implemented.
5. Validate accessibility and responsiveness.
6. Run lint/type/build checks.

## Implementation Rules
- Prefer small composable components over monoliths.
- Avoid introducing new UI frameworks unless requested.
- Keep `data-testid` stable for QA-critical interactions.
- Use semantic HTML and keyboard-accessible controls.
- Do not hardcode secrets or environment-specific URLs.

## Quality Checklist
- No TypeScript errors.
- No ESLint violations.
- Touch targets and focus states are usable on mobile/keyboard.
- Images include meaningful `alt` text.
- Expensive renders are memoized only when needed and measurable.

## Handoff
Provide:
- Changed files and behavior summary.
- Any new contract requirements for backend.
- QA scenarios for regression coverage.

## References
- For UI validation and PR templates, use `references/ui-checklists.md`.
