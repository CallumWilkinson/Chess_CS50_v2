# Codex Configuration

## Abstraction Precedence

Simplicity Addendum takes precedence on any abstraction decision. If Codex and Simplicity conflict, follow Simplicity.

## Development Guidelines

- Environment: Windows 11, PowerShell, VS Code.
- Use ES6 `class` syntax and object-oriented design when the Simplicity gates permit it.
- Use ES modules (`import` and `export`) only, never CommonJS.
- Avoid ternary operators, prefer explicit `if` and `else`.
- Use `await` with `try` and `catch`, not `.then()`.
- Keep files and classes single responsibility.
- Avoid magic behavior, keep flow explicit and traceable.
- Prioritize readability over performance unless performance is a proven bottleneck.

## Clean Code Principles

- Naming: descriptive and consistent. Prefer `calculateScore` or `isValidMove`. Avoid `temp`, `foo`, or `x` except in tiny scopes.
- Functions: small and focused, one task each.
- DRY: extract reusable logic, do not copy and paste.
- Control flow: return early, avoid deep nesting, avoid `else` after `return`.
- Comments: write only intent, assumptions, side effects, or gotchas. Do not narrate obvious code.
- Magic values: replace with named constants like `MAX_SCORE` or `USER_TYPE_ADMIN`.
- Separation: keep business logic, UI, and data in separate layers.
- Errors: handle explicitly with guard clauses or `try` and `catch`. Do not swallow errors.
- Global state: minimize. Prefer parameters and explicit dependencies.

## Architectural Consistency

- If code expects properties or methods that are not in class definitions, treat this as a red flag.
- Compare real class structure with usage.
- Fix the architecture, not just the symptom.
- Add needed properties in constructors or through proper methods.

### Allowed Roles and Where They Belong

Use this allow-list to keep names and responsibilities consistent.

- **Entity**: has identity and mutable domain state, rules tied to that state.
- **ValueObject**: immutable, equality by value, no identity.
- **Policy**: pure rules that decide outcomes, no IO.
- **Adapter**: wraps an external API or framework, isolates IO at the edge.
- **Repository**: persistence boundary that returns Entities or ValueObjects, only if persistence exists.
- **Coordinator**: rare, short orchestration for one specific use case. Must reference that scenario in its docstring.
- **Controller**: allowed only at framework boundaries, never in core domain.

If a proposed class name is not covered by these roles, justify it through the Abstraction Gate and also propose the closest allow-listed alternative.

### Banned or Suspect Names

Avoid opaque nouns that hide intent. Examples to avoid: `Manager`, `Service`, `Helper`, `Util`, `Base`, `Factory`, `Controller` outside boundaries, `Engine`, `Core`, `Lifecycle`. Prefer domain nouns like `GameSession`, `TurnOrderPolicy`, `SocketIoAdapter`.

## Testing Rules

**TDD is mandatory.** Follow a strict Red to Green to Refactor loop.

- **Red**: write a failing unit test for a small slice of behavior.
- **Green**: write the minimal implementation to make that test pass.
- **Refactor**: clean code and tests without changing behavior. Remove duplication and improve names.
- Repeat for the next slice.

Additional rules:

- Never omit tests unless explicitly told to for this task. If a test is omitted, explain why it cannot or should not be tested.
- You must run all tests before suggesting changes.
- A unit test is required for every new function or logic change.
- Place tests in `__tests__` or `*.test.js`. Use Jest syntax.
- Update or extend relevant tests when logic changes.
- Tests must run independently. Use mock data or mocks where needed.
- Prefer real class instances over mocks. Mock only external dependencies or hard-to-reproduce failures.

**Class-specific testing alignment**

- Every Entity must have a behavior test that mutates its state and asserts an outcome.
- Policies and ValueObjects are tested as pure computations.
- Adapters are tested with fakes at the boundary. Do not leak vendor types into domain tests.
- If a class is hard to test without heavy mocks, demote it to functions or split IO into an Adapter.

Expectations:

- Use real class behavior. Do not override properties except when that override is the subject of the test.
- Let constructors run and use generated IDs in assertions when applicable.
- Override only when needed for edges or predictable assertions.
- Read the class files before writing tests.
- Never assume a property exists without verifying it in the constructor or contract.
- If usage and definition mismatch, fix usage or architecture, not tests to match a bug.
- Keep tests DRY. Test observable outcomes, not internal implementation details.

## Code Documentation Guidelines

**Comment philosophy**

- Comment only when the reason or assumption is not clear from code.
- Prefer clear names and structure over inline comments.
- Treat outdated comments as bugs. Remove or update them.

**Comment style rules**

- Use lowercase unless names or acronyms require capitals.
- No space after `//`: write `//comment` not `// comment`.
- Keep the tone informal and direct.

**JSDoc**

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

**Pull Request Template**

Use this template for every PR.

```
### Abstraction Gate
Role:
Responsibility:
Why not simpler:
Meaningful state fields:
Public surface (list of public methods):
Usage-first sample:

### Test Evidence
- Added or updated tests:
- Behavior covered:

### Impact
- Files touched:
- Alternatives rejected:
```

## Task Scope and Context Limits

- If a task exceeds available context, stop and decompose it into small sequential steps.
- After each step ask whether to continue with the single word continue.
- Summarize completed work at the end.
- Be ready to explain your decomposition if asked.

## Refactoring Expectations

- Mark unclear legacy code with `//legacy:`. Do not delete unless you are certain it is unused.
- Flag risks and explain reasoning.
- Question assumptions and architecture.
- Recommend structural fixes, not just surface changes.
- Do not include tool attributions like Generated with.

**Refactoring triggers**

Inline or collapse when:

- A class only forwards calls.
- A class only stores dependencies.
- A class has only getters or setters.
- Two adjacent layers always change together or the higher layer contains no domain decisions.

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
- Small, focused, object-oriented modules that pass the gates.
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
- Avoid cross-file execution order coupling. Wire dependencies explicitly.
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

- Each commit should answer what changed and why.
- Commits are self-contained and pass tests.
- Avoid committing broken WIP. Use branches locally for drafts.
- When reverting, explain why in the message.
- Use present tense in summaries.

## Refactoring Guidance — Extended Mindset

- Refactor with intent. Extract abstractions only when both sides benefit.
- When renaming a class, confirm responsibility and API.
- If old code is unclear, flag it instead of guessing.
- Prefer safety. Comment rather than delete when unsure.

## Additional Tips

- Design for testability: pure functions and predictable side effects.
- Prefer explicitness. Avoid hidden dependencies and side effects.
- Model the domain first, then code.
- Make debugging easy with meaningful logs, clear errors, and tight commits.
- Design for change. Keep seams and interfaces flexible.

**Analogy**

Classes are labeled toolboxes that keep the tools they really use. If a class holds no tools or only passes tools to someone else, do not buy the toolbox.

---
