# Codex Configuration (Condensed)

## Development Guidelines

- Environment: Windows 11, PowerShell, VS Code.
- Use ES6 `class` syntax and object-oriented design.
- Use ES modules (`import` / `export`) only, never CommonJS.
- Avoid ternary operators, prefer explicit `if/else`.
- Use `await` with `try/catch`, not `.then()`.
- Keep files and classes single-responsibility.
- Avoid “magic” behavior, make flow explicit and traceable.

## Clean Code Principles

- Naming: descriptive and consistent. Prefer `calculateScore`, `isValidMove`. Avoid `temp`, `foo`, `x` except for tiny scopes.
- Functions: small and focused, one task each.
- DRY: extract reusable logic, do not copy-paste.
- Control flow: return early, avoid deep nesting and `else` after `return`.
- Comments: write only intent or assumptions, never obvious narration.
- Magic values: replace with named constants like `MAX_SCORE`, `USER_TYPE_ADMIN`.
- Separation: keep business logic, UI, and data in separate layers.
- Errors: handle explicitly with guard clauses or `try/catch`; do not swallow.
- Global state: minimize; pass data via parameters.
- Tests: meaningful coverage of core logic, edges, and failures.
- Architectural consistency (critical):

  - If code expects properties or methods not in class definitions, treat as a red flag.
  - Compare real class structure with usage.
  - Fix the architecture, not just the symptom.
  - Add needed properties in constructors or proper methods.

## Testing Rules

- A unit test is required for every new function or logic change. If omitted, explain why.
- Place tests in `__tests__` or `*.test.js`, use Jest.
- Update tests when logic changes.
- Prefer real class instances over mocks. Mock only external dependencies or hard-to-reproduce errors.
- Expectations (critical):

  - Use real class behavior, do not override properties except to test that override.
  - Let constructors run and use generated IDs in assertions.
  - Override only when needed for edges or predictable assertions.
  - Read the actual class files before writing tests.
  - Never assume a property exists without verifying or seeing it in the constructor.
  - If usage and definition mismatch, fix the usage rather than the test.

- DRY in tests. Test outcomes, not internal implementation.
- Prioritize readability over micro-performance.
- Run all tests before proposing changes. Do not break existing tests.
- Follow strict TDD: Red (failing test) → Green (minimal code) → Refactor.

## Code Documentation Guidelines

- Comment philosophy:

  - Comment only when the reason or assumption is not clear from code.
  - Make code self-explanatory; avoid “what it does” comments.
  - Prefer clear names and structure over inline comments.
  - Treat outdated comments as bugs; remove or update them.

- JSDoc:

  - Use for parameters, return types, side effects, and contracts.
  - Always include JSDoc for constructors and public methods.
  - Keep type annotations even when names are obvious.
  - Remove redundant prose; keep useful type info.

## Git Commit Guidelines

**Format**

```
<type>: <short summary>

<details if needed>
```

**Types**: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`.

**Content**

- Use bullet points for multiple items.
- Be concise and clear for future readers.
- One commit per logical change.
- Final output must include a clean, copy-pasteable commit message plus a human-readable summary.

**Workflow for complex tasks**

- Show all changes together, then explain how to split into commits.
- One concern per commit. Try to keep added lines under 100 and changed files under 4.
- Where sensible, bundle logic and its tests in the same commit.
- Every commit must leave the code working and follow Conventional Commits.

**Review and Approval Process**

- Never commit for me.
- Make one logical change at a time, stage only relevant files, then output:

  - Staged filenames
  - The commit message
  - A short summary

- Wait for feedback before the next change.
- Do not bundle unrelated changes.
- Provide a brief analysis of reasoning in every reply.

## Task Scope and Context Limits

- If a task exceeds context, stop, decompose into small sequential steps, and clearly label them.
- After each step ask whether to proceed with “continue”.
- Summarize completed work at the end.
- Be ready to explain the decomposition on request.

## Refactoring Expectations

- Mark unclear legacy code with `//legacy:`; do not delete unless certain it is unused.
- Flag risks and explain reasoning.
- Question assumptions and architecture.
- Recommend structural fixes, not just surface changes.
- Do not include “Generated with Claude Code” or similar attributions.

## AI Commenting Rules

1. Comment only when intent is not obvious.
2. Do not narrate what code does.
3. State assumptions.
4. Flag non-obvious or surprising behavior.
5. Call out gotchas, edge cases, workarounds.
6. Use `TODO`, `FIXME`, `HACK` responsibly.
7. Use JSDoc for types and contracts.
8. Do not comment every line.
9. Comments must be truthful.
10. Delete comments that no longer add value.
11. Leave breadcrumbs for future maintainers.

**Example: Good vs Bad**

- Bad:

```js
// Loop through items
for (let i = 0; i < items.length; i++) {
```

- Good:

```js
// Skip the first item because it is a system default
for (let i = 1; i < items.length; i++) {
```

## Developer Philosophy

- Write for humans first, prioritize clarity over cleverness.
- Small, focused, object-oriented modules.
- Readability and maintainability over performance tricks.
- Use Git to tell a story.
- Leave tests and comments as breadcrumbs.
- Challenge assumptions and architecture.
- Collaborate, even when solo.

## Comment Philosophy — Extended

- Use comments for assumptions, non-obvious decisions, platform quirks, and business rules that code cannot express well.
- Prefer structure over inline comments. Group logic into small, well-named functions.
- Keep JSDoc detailed for public APIs and utilities; keep internal function JSDoc minimal but typed.

## Clean Code — Extended

- Prefer many small, well-named files over catch-alls.
- Treat naming as design; good names remove comment needs.
- Avoid cross-file execution order coupling; wire dependencies explicitly.
- Avoid cleverness; keep code clear.
- Encode assumptions in code via defaults and guards.
- Keep formatting, spacing, and organization consistent.
- Write for the future reader.

## Testing Philosophy — Extended

- Behavior-oriented test names.
- Minimal, descriptive setups, shallow or no mocks.
- Use helpers for common setup to avoid repetition.
- Favor real flows; mock only externals.
- Cover edges, failures, and defaults.
- Test observable outcomes, not internals.

## Git Hygiene — Expanded Practices

- Each commit should answer “what changed” and “why”.
- Commits are self-contained and pass tests.
- Avoid committing broken WIP; use branches locally.
- When reverting, explain why in the message.
- Use present tense in summaries.

## Refactoring Guidance — Extended Mindset

- Refactor with intent. Extract abstractions only when both sides benefit.
- When renaming a class, confirm responsibility and API.
- If old code is unclear, flag it instead of guessing.
- Prefer safety: comment rather than delete when unsure.

## Additional Tips

- Design for testability: pure functions and predictable side effects.
- Prefer explicitness: avoid hidden dependencies and side effects.
- Model the domain first, then code.
- Make debugging easy with meaningful logs, clear errors, and tight commits.
- Design for change: keep seams and interfaces flexible.

## Context-Aware Execution and Decomposition Protocol

1. If a task is too large, stop and do not guess.
2. Break into small, ordered subtasks.
3. After each subtask, ask to proceed.
4. Summarize completed steps.
5. Be ready to justify the breakdown.

### Commit Granularity Analysis

- After suggesting a commit or plan, explain the boundaries:

  - Either justify a single commit if the changes are tightly coupled and cannot be separated safely.
  - Or propose a split, for example: one per module, one for logic and one for tests, or rename/refactor first then add functionality.

---

## Example Commit Explanation (Condensed but Complete)

**Commit message**

```
feat: add SessionManager and chess color assignment module

Replace misnamed Database with SessionManager and extract color logic

- SessionManager.js: rename Database → SessionManager; clearer methods (addSession, removeSession); drop game-specific logic; manage gameSessions, connectedPlayers, socketID→gameSessionID
- chessColorAssignment.js: extract color assignment; first player black, second white; handle null/undefined; separable, reusable, testable
- tests: add SessionManager and color assignment tests

Rationale: remove duplication and separate networking from chess rules
```

**Summary for review**

- `SessionManager.js` replaces `Database.js` with better naming and focused responsibility.
- Color assignment moved into `backend/gameLogic/chessColorAssignment.js`, follows chess convention, handles edges, reusable, testable.
- Tests added for both modules.

**Files to stage**

```
git add backend/gameSetup/SessionManager.js
git add backend/gameLogic/chessColorAssignment.js
git add tests/SessionManager.test.js
git add tests/chessColorAssignment.test.js
```

**Commit granularity note**

- Keep as one commit if introducing both module rename and extracted logic together is required to keep tests green and avoid broken intermediate states.
- Alternatively split into:

  1. `refactor: rename Database to SessionManager and adjust imports`
  2. `feat: extract chessColorAssignment module`
  3. `test: add coverage for SessionManager and color assignment`

---
