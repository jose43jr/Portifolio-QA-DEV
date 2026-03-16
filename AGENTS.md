# AGENTS.md instructions for h:\WebProtifólio

<INSTRUCTIONS>
## Skills
A skill is a set of local instructions to follow that is stored in a `SKILL.md` or `skill.md` file. Below is the list of skills that can be used. Each entry includes a name, a short description, and the file path so you can open the source for full instructions when using a specific skill.

### Available skills
- skill-creator: Skill for creating or updating Codex skills. (file: C:/Users/feito/.codex/skills/.system/skill-creator/SKILL.md)
- skill-installer: Skill for installing Codex skills from curated sources or repository paths. (file: C:/Users/feito/.codex/skills/.system/skill-installer/SKILL.md)
- api-design-principles: Skill for API design principles and conventions. (file: C:/Users/feito/.codex/skills/api-design-principles/skill.md)
- api-security-best-practices: Skill for API security and hardening practices. (file: C:/Users/feito/.codex/skills/api-security-best-practices/skill.md)
- backend-architect: Skill for backend architecture decisions. (file: C:/Users/feito/.codex/skills/backend-architect/skill.md)
- backend-dev-guidelines: Skill for backend development standards and workflows. (file: C:/Users/feito/.codex/skills/backend-dev-guidelines/skill.md)
- brainstorming: Skill for ideation and solution exploration. (file: C:/Users/feito/.codex/skills/brainstorming/skill.md)
- clean-code: Skill for cleaner and more maintainable code. (file: C:/Users/feito/.codex/skills/clean-code/skill.md)
- concise-planning: Skill for short and actionable implementation plans. (file: C:/Users/feito/.codex/skills/concise-planning/skill.md)
- frontend-design: Skill for frontend design and UI decisions. (file: C:/Users/feito/.codex/skills/frontend-design/skill.md)
- git-pushing: Skill for preparing and pushing Git changes safely. (file: C:/Users/feito/.codex/skills/git-pushing/skill.md)
- lint-and-validate: Skill for linting and project validation workflows. (file: C:/Users/feito/.codex/skills/lint-and-validate/skill.md)
- python-pro: Skill for advanced Python implementation practices. (file: C:/Users/feito/.codex/skills/python-pro/skill.md)
- security-audit: Skill for security-focused review and auditing. (file: C:/Users/feito/.codex/skills/security-audit/skill.md)
- seo-audit: Skill for SEO review and optimization checks. (file: C:/Users/feito/.codex/skills/seo-audit/skill.md)
- software-architecture: Skill for software architecture analysis and design. (file: C:/Users/feito/.codex/skills/software-architecture/skill.md)
- systematic-debugging: Skill for structured debugging workflows. (file: C:/Users/feito/.codex/skills/systematic-debugging/skill.md)
- test-automator: Skill for automated testing workflows. (file: C:/Users/feito/.codex/skills/test-automator/skill.md)
- test-driven-development: Skill for TDD workflows and iteration. (file: C:/Users/feito/.codex/skills/test-driven-development/skill.md)
- testing-qa: Skill for QA and testing practices. (file: C:/Users/feito/.codex/skills/testing-qa/skill.md)
- ui-ux-designer: Skill for UI/UX design decisions. (file: C:/Users/feito/.codex/skills/ui-ux-designer/skill.md)
- ui-ux-pro-max: Skill for advanced UI/UX refinement. (file: C:/Users/feito/.codex/skills/ui-ux-pro-max/skill.md)
- vulnerability-scanner: Skill for vulnerability scanning and assessment. (file: C:/Users/feito/.codex/skills/vulnerability-scanner/skill.md)

### How to use skills
- Discovery: The list above is the skills available in this project context. Skill bodies live on disk at the listed paths.
- Trigger rules: If the user names a skill (with `$SkillName` or plain text) OR the task clearly matches a skill's description shown above, use that skill for that turn. Multiple mentions mean use them all. Do not carry skills across turns unless re-mentioned.
- Missing/blocked: If a named skill is not in the list or the path cannot be read, say so briefly and continue with the best fallback.
- How to use a skill (progressive disclosure):
  1) After deciding to use a skill, open its `SKILL.md` or `skill.md`.
  2) Read only enough to follow the workflow.
  3) When the skill file references relative paths, resolve them relative to the skill directory listed above first.
  4) If `scripts/` exist, prefer running or patching them instead of retyping large code blocks.
  5) If `assets/` or templates exist, reuse them instead of recreating from scratch.
- Coordination and sequencing:
  1) If multiple skills apply, choose the minimal set that covers the request and state the order.
  2) Announce which skill or skills are being used and why in one short line.
- Context hygiene:
  1) Keep context small and load only files that are needed.
  2) Avoid deep reference-chasing unless blocked.
  3) When variants exist, pick only the relevant one and note that choice.
- Safety and fallback: If a skill cannot be applied cleanly, state the issue, pick the next-best approach, and continue.
</INSTRUCTIONS>
