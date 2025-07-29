# Claude Code Configuration

## Development Guidelines

- Environment: Windows 11, PowerShell, VS Code
- Follow existing project formatting and naming conventions
- Use ES6 `class` syntax and organize logic using object-oriented principles
- Use ECMAScript modules (`import` / `export`) only — do not use CommonJS (`require`)
- Avoid ternary operators – use explicit `if/else` statements for clarity
- Use `await` with `try/catch` blocks instead of `.then()` for async JavaScript
- Write clean, modular code where each file or class has a single responsibility
- Never rely on "magic" behavior — everything should be traceable and explicit

### 🔍 Beginner Red Flag Avoidance Rules

- ✅ **Use Descriptive, Consistent Naming**

  - DO: Name things clearly (e.g., `calculateScore`, `isValidMove`).
  - DON’T: Use names like `temp`, `foo`, `x` unless absolutely obvious in short scope.

- ✅ **Keep Functions Small and Focused**

  - DO: Each function should do one thing only.
  - DON’T: Mix concerns like logic, UI, and API calls in one function.

- ✅ **Eliminate Repetition**

  - DO: Abstract repeated logic into reusable functions.
  - DON’T: Copy/paste the same code in multiple places.

- ✅ **Flatten Control Flow**

  - DO: Return early and avoid deeply nested logic.
  - DON’T: Use excessive `if/else` nesting or `else` after `return`.

- ✅ **Comment Only Intent or Assumptions**

  - DO: Write `//` comments only when intent or assumption is unclear.
  - DON’T: Write obvious `// increment i`-style comments.

- ✅ **Replace Magic Numbers and Strings**

  - DO: Use constants with names like `MAX_SCORE` or `USER_TYPE_ADMIN`.
  - DON’T: Use unexplained numbers like `if (type === 3)`.

- ✅ **Separate Concerns Clearly**

  - DO: Isolate business logic, UI, and data in separate layers or files.
  - DON’T: Blend them together.

- ✅ **Handle Errors Explicitly**

  - DO: Handle errors with `try/catch` or guard clauses.
  - DON’T: Swallow errors or log them silently.

- ✅ **Minimize Global State**

  - DO: Pass variables explicitly as function arguments.
  - DON’T: Depend on external or global state where avoidable.

- ✅ **Write Meaningful Tests**

  - DO: Cover core logic, edge cases, and failure modes.
  - DON’T: Write placeholder tests that check nothing useful.

- **CRITICAL: Architectural consistency**

  - When you encounter code that expects properties or methods that don't exist in the actual class definitions:
    - This is a red flag indicating architectural inconsistency
    - Always investigate the actual class structure vs. usage patterns
    - Fix the architectural problem rather than accommodating it
    - If classes need additional properties, add them to the class constructor or create proper methods

- You must write a unit test for every new function or logic change. This is not optional.

  - If a test is not included, clearly explain _why it cannot or should not be tested_
  - Place the test in a dedicated `__tests__` or `*.test.js` file, following the existing test structure
  - Use `jest` syntax for all test code
  - If modifying existing logic, update or extend the relevant test
  - Tests must run independently and use actual class instances (Player, GameSession, etc.) instead of mock objects whenever possible
  - Only use mock objects when testing external dependencies (APIs, databases, file systems) or error scenarios that are hard to reproduce with real objects

  - **CRITICAL: Testing expectations**

    - Always use the real class behavior in tests — never manually override class properties unless specifically testing that override behavior
    - Let constructors run their full initialization logic and use the results
    - If a class constructor automatically generates IDs, use those auto-generated IDs in tests
    - Only override values when needed for edge cases or predictable test assertions
    - Read the actual class files to understand structure before testing
    - Never assume a property exists unless you’ve verified it dynamically or in the constructor
    - If you find a mismatch between class definitions and usage, fix the usage, not the test

  - Tests must follow the DRY principle
  - Tests must test the real code, not reimplemented logic
  - Never omit this unless explicitly told to skip tests for this task
  - Prioritize code readability over performance optimization
  - Run all tests before suggesting changes
  - All new code must not break previous tests
  - Follow Test-Driven Development (TDD) strictly in a Red-Green-Refactor loop:
    - Red: Write a failing unit test for a small piece of functionality
    - Green: Write the minimal code needed to make that test pass
    - Refactor: Clean up both the test and implementation, improving readability without changing behavior

## Code Documentation Guidelines

### Comment Philosophy

- Only write comments when the _reason_ for the code is unclear from the code itself
- Never explain what the code is doing — make the code explain itself
- Use descriptive variable and function names instead of inline comments
- Comments are a code smell and often mean the code is not self-explanatory
- If you need to explain something, ask whether the code could be refactored instead
- Avoid comments that can become outdated — these are a maintenance burden
- Use JSDoc only to explain function arguments, return values, side effects, or contracts — treat JSDoc as part of the public interface, not internal explanation
- Do not comment every line
  - Group logic into meaningful functions and name them clearly
  - Use code organization and naming to convey purpose instead of comments
  - Only write `//` comments for non-obvious _why_ explanations or edge-case handling

## Git Commit Guidelines

### Format

Use the following structure:

```
<type>: <short summary>

<detailed explanation, if needed>
```

### Commit Types (Conventional Commits)

- `feat:` for new features
- `fix:` for bug fixes
- `refactor:` for code reorganization without behavior changes
- `test:` for test updates or additions
- `docs:` for documentation updates
- `chore:` for non-code updates like configs or scripts

### Commit Content Guidelines

- Use bullet points (`-`) for multiple changes in the body
- Be concise but clear — like you're explaining it to future you or a teammate
- Only generate **one commit message per logical change**
- The final output **must include a clean, copy-pasteable commit message** formatted as if it were being submitted to a professional team repo
- In addition to the commit message, also output a human-readable breakdown in the example style below so I can skim and understand what changed before I copy-paste the commit

### Commit Workflow for Complex Tasks

- If a task requires **multiple changes**, show all the changes at once — do **not** drip-feed changes line by line
- Then, explain how you would break those changes up into multiple commits
- **Always try to bundle logic and its test into the same commit** where it makes sense to do so
- Always group the changes into logical units based on what was modified, and suggest a clear, descriptive commit message for each group. However, if you can think of a logical argument to keeping all these changes in one commit please provide your reasoning.
- I’ll review the full set of changes, and we’ll decide the final commit structure together

- Each commit must leave the codebase in a working state
- Use a proper [Conventional Commit](https://www.conventionalcommits.org/) message

#### Example of the explanation I want (in addition to the actual commit):

```
feat: add SessionManager and chess color assignment module

Replace Database with better-named SessionManager and extract color logic

SessionManager.js (replaces Database.js)
- Renamed "Database" to "SessionManager" for clearer purpose (it's not actually a database)
- Cleaner method names: addSession() vs createSession(), removeSession() vs deleteSession()
- Removed game-specific logic - now focused purely on session/player management
- Same core functionality: manages gameSessions, connectedPlayers, and socketIDtoGameSessionID mappings

chessColorAssignment.js (extracted logic)
- Extracts color assignment logic that was previously duplicated across multiple classes
- Follows chess convention: first player gets black, second gets white
- Handles edge cases (null/undefined players gracefully)
- Separates chess-specific game rules from networking layer for better modularity
- Makes color logic reusable and easily testable in isolation
- Sets foundation for future games to have their own team assignment modules

Why this refactor?
Before: Color assignment logic duplicated in Database.js, GameSession.js, and GameInstance.js
After: Clean separation — SessionManager handles networking, chessColorAssignment handles game rules

Files to stage for this commit:
git add backend/gameSetup/SessionManager.js
git add backend/gameLogic/chessColorAssignment.js
git add tests/SessionManager.test.js
git add tests/chessColorAssignment.test.js
```

### Review and Approval Process

- Do **not** auto-commit
- Instead, after each change:

  - **Make only one logical change**
  - **Stage only the files related to that change**
  - Output:
    - The staged filenames
    - The commit message (clean, final format)
    - A short summary/explanation in the above format
  - Then **pause and wait for feedback**

- I will manually review the change, give feedback, and run:

```bash
git add .
git commit -m "your commit message"
git push
```

- Only after I confirm the change is accepted should you continue with the next small change
- Never bundle unrelated changes into a single commit
- Never move on to the next task without confirmation
- In every reply, give a separate analysis of your changes explaining your reasoning and thought process

## Task Scope & Context Limits

- If I give you a **large refactor task** (e.g. “update all tests to use a new abstraction”) and you **cannot fit it all into one prompt**, just do **a small chunk** and tell me that I’ll need to re-run you to finish it.
  - Don’t make me guess what you missed.
  - Example: say clearly, “This is just the first 3 files — please ask again to continue.”
- If I ask something like “refactor all tests to use this helper function”, make sure you **check every relevant file** unless you’ve run out of context.
- I should never have to ask, “Did you check all the test files?”

## Refactoring Expectations

- If you encounter old or unclear code during a refactor:
  - Label it with a `//legacy:` comment and **do not delete it** unless you're **absolutely sure** it’s unused
  - Flag it clearly for my review and explain your reasoning
  - If you’re unsure whether it’s safe to remove, say so
- Always question my assumptions and the original architecture — your job is to **challenge design flaws**, not just execute blindly
- Point out anything that looks like a deeper structural issue or anti-pattern and recommend fixes

- Do **NOT** write 🤖 Generated with Claude Code Co-Authored-By: Claude <noreply@anthropic.com>

## AI Commenting Rules (Human-Readable)

1. **Only comment when the reason or intent is not obvious from the code.**
2. **Never comment what the code is doing — make the code explain itself.**
3. **Always explain assumptions if they are not explicit in the code.**
4. **Flag any unexpected or non-obvious behavior.**
5. **Add comments for “gotchas”, edge cases, or workarounds.**
6. **Use `TODO`, `FIXME`, and `HACK` tags responsibly.**
7. **Use JSDoc for function arguments, return values, side effects, and contracts.**
8. **Do not comment every line.**
9. **Comments must never lie.**
10. **Delete comments that explain now-obvious code.**

### 💡 Example: Good vs Bad Comment

Bad:

```js
// Loop through items
for (let i = 0; i < items.length; i++) {
```

Good:

```js
// Skip the first item because it’s always a system default
for (let i = 1; i < items.length; i++) {
```

---

### Bonus Tip: Comment Like You're Leaving Breadcrumbs for Future-You

If you disappeared tomorrow, would someone else know what your _intent_ was? If not, drop a quick `//` explaining what assumptions you're making or why a decision was made.
