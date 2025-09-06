# Codex Configuration

## Development Guidelines

- Environment: Windows 11, PowerShell, VS Code.
- Use ES6 `class` syntax and object-oriented design.
- Use ES modules (`import` / `export`) only, never CommonJS.
- Avoid ternary operators, prefer explicit `if/else`.
- Use `await` with `try/catch`, not `.then()`.
- Keep files and classes single responsibility.
- Avoid “magic” behavior, make flow explicit and traceable.
- Prioritize readability over performance unless performance is a proven bottleneck.

## Clean Code Principles

- Naming: descriptive and consistent. Prefer `calculateScore`, `isValidMove`. Avoid `temp`, `foo`, `x` except in tiny scopes.
- Functions: small and focused, one task each.
- DRY: extract reusable logic, do not copy-paste.
- Control flow: return early, avoid deep nesting, avoid `else` after `return`.
- Comments: write only intent, assumptions, side effects, or gotchas. Do not narrate obvious code.
- Magic values: replace with named constants like `MAX_SCORE`, `USER_TYPE_ADMIN`.
- Separation: keep business logic, UI, and data in separate layers.
- Errors: handle explicitly with guard clauses or `try/catch`. Do not swallow errors.
- Global state: minimize. Prefer parameters and explicit dependencies.
- Architectural consistency:

  - If code expects properties or methods that are not in class definitions, treat that as a red flag.
  - Compare real class structure with usage.
  - Fix the architecture, not just the symptom.
  - Add needed properties in constructors or through proper methods.

## Testing Rules

- **TDD is mandatory.** Follow a strict Red → Green → Refactor loop.

  - **Red:** write a failing unit test for a small slice of behavior.
  - **Green:** write the minimal implementation to make that test pass.
  - **Refactor:** clean the code and the test without changing behavior. Remove duplication and improve names.
  - Repeat for the next small slice.

- **Never omit tests unless explicitly told to for this task.** If a test is omitted, you must explain why it cannot or should not be tested.
- **You must run all tests before suggesting changes.**
- A unit test is required for every new function or logic change.
- Place tests in `__tests__` or `*.test.js`. Use Jest syntax.
- Update or extend relevant tests when logic changes.
- Tests must run independently. Use mock data or mocks where needed.
- Prefer real class instances over mocks. Mock only external dependencies or hard-to-reproduce failures.
- Expectations:

  - Use real class behavior. Do not override properties except when the override is the subject of the test.
  - Let constructors run and use generated IDs in assertions when applicable.
  - Override only when needed for edges or predictable assertions.
  - Read the actual class files before writing tests.
  - Never assume a property exists without verifying it in the constructor or the class contract.
  - If usage and definition mismatch, fix the usage or fix the architecture, not the test to match a bug.

- DRY in tests. Test observable outcomes, not internal implementation details.

## Code Documentation Guidelines

- **Comment philosophy:**

  - Comment only when the reason or assumption is not clear from code.
  - Prefer clear names and structure over inline comments.
  - Treat outdated comments as bugs. Remove or update them.

- **Comment style rules:**

  - Use lowercase unless required by names or acronyms.
  - **No space after `//`: write `//comment`, not `// comment`.**
  - Keep the tone informal and direct, like notes to your future self.

- **JSDoc:**

  - Use JSDoc for parameters, return types, side effects, and contracts.
  - Always include JSDoc for constructors and public methods.
  - Keep type annotations even when names are obvious.
  - Remove redundant prose. Keep useful type information and contracts.

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

- Show all changes together and explain how to split them into commits if they are not tightly coupled.
- One concern per commit. Aim for fewer than 100 added lines and fewer than 4 changed files when sensible.
- Where sensible, bundle logic and its tests in the same commit.
- Every commit must leave the code working and must follow Conventional Commits.

## Review and Approval Process

- Never commit for the user.
- Make one logical change at a time. Stage only relevant files. Then output:

  - Staged filenames
  - The commit message
  - A short summary

- Wait for feedback before the next change.
- Do not bundle unrelated changes.
- Provide a brief analysis of your reasoning in every reply.

## Task Scope and Context Limits

- If a task exceeds the available context, stop and decompose it into small sequential steps.
- After each step ask whether to continue with “continue”.
- Summarize completed work at the end.
- Be ready to explain your decomposition if asked.

## Refactoring Expectations

- Mark unclear legacy code with `//legacy:`. Do not delete unless you are certain it is unused.
- Flag risks and explain reasoning.
- Question assumptions and architecture.
- Recommend structural fixes, not just surface changes.
- Do not include tool attributions like “Generated with ...”.

## AI Commenting Rules

1. Comment only when intent is not obvious.
2. Do not narrate what code does.
3. State assumptions.
4. Flag non-obvious or surprising behavior.
5. Call out gotchas, edge cases, and workarounds.
6. Use `TODO`, `FIXME`, and `HACK` responsibly.
7. Use JSDoc for types and contracts.
8. Do not comment every line.
9. Comments must be truthful.
10. Delete comments that no longer add value.
11. Leave breadcrumbs for future maintainers.

**Example: Good vs Bad**

- Bad:

  ```js
  //loop through items
  for (let i = 0; i < items.length; i++) {}
  ```

- Good:

  ```js
  //skip index 0 because it is a system default
  for (let i = 1; i < items.length; i++) {}
  ```

## Developer Philosophy

- Write for humans first. Choose clarity over cleverness.
- Small, focused, object-oriented modules.
- Readability and maintainability over micro-optimizations.
- Use Git to tell a story.
- Leave tests and comments as breadcrumbs.
- Challenge assumptions and architecture.
- Collaborate, even when solo.

## Comment Philosophy — Extended

- Use comments for assumptions, non-obvious decisions, platform quirks, and business rules that code cannot express well.
- Prefer structure over inline comments. Group logic into small, well-named functions.
- Keep JSDoc detailed for public APIs and utilities. Keep internal function JSDoc minimal but typed.

## Clean Code — Extended

- Prefer many small, well-named files over catch-all modules.
- Treat naming as design. Good names reduce the need for comments.
- Avoid cross-file execution-order coupling. Wire dependencies explicitly.
- Avoid cleverness. Keep code clear.
- Encode assumptions in code with defaults and guards.
- Keep formatting, spacing, and organization consistent.
- Write for the future reader.

## Testing Philosophy — Extended

- Behavior-oriented test names.
- Minimal, descriptive setups. Shallow or no mocks where possible.
- Use helpers for common setup to avoid repetition.
- Favor real flows. Mock only externals.
- Cover edges, failures, and defaults.
- Test observable outcomes, not internals.

## Git Hygiene — Expanded Practices

- Each commit should answer “what changed” and “why”.
- Commits are self-contained and pass tests.
- Avoid committing broken WIP. Use branches locally for drafts.
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
