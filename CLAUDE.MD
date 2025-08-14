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

### 🔍 Clean Code Principles for Consistency

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

- **NEVER COMMIT ANYTHING UNDER ANY CIRCUMSTANCES**
- **NEVER use `git commit` - I will handle all commits myself**
- Instead, after each change:

  - **Make only one logical change**
  - **Stage only the files related to that change using `git add`**
  - Output:
    - The staged filenames
    - The commit message (clean, final format)
    - A short summary/explanation in the above format
  - Then **pause and wait for feedback**
  - **DO NOT COMMIT - only provide the commit message**

- I will manually review the change, give feedback, and run:

```bash
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
11. **Comment Like You're Leaving Breadcrumbs for Future-You**

If you disappeared tomorrow, would someone else know what your _intent_ was? If not, drop a quick `//` explaining what assumptions you're making or why a decision was made.

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

## 🧭 Developer Philosophy (Reference)

These principles define the kind of developer this workflow is built for:

- Write code for humans first — clarity over cleverness
- Small, focused, object-oriented modules are easier to test and understand
- Prioritize readability and maintainability over raw performance
- Use Git as a narrative tool — tell a story with your commits
- Leave tests and comments like breadcrumbs for your future self
- Be skeptical of assumptions — if something feels off, question it
- Treat your work as collaborative, even if you’re the only contributor

---

## 🔁 Comment Philosophy (Extended Guidance)

Write comments only when the **intent**, **assumption**, or **why** is not immediately clear from the code.

- ❌ Never explain what the code is doing — improve the code to explain itself
- ✅ Use comments to clarify:

  - Assumptions being made (e.g. "input is expected to be sorted")
  - Why a non-obvious decision was made
  - Platform bugs or quirks (`// HACK:` or `// FIXME:`)
  - Business rules that aren’t obvious from the code structure

- ✅ Use `JSDoc` for function arguments, return values, side effects, and contracts

  - **Always include JSDoc for constructors and public methods** - provides valuable type information for IDEs and tooling
  - **Keep parameter type annotations** even when parameter names are obvious (e.g., `@param {string} username`) - this serves tooling, not just documentation
  - **Focus JSDoc cleanup on redundant descriptions**, not type information (remove "The username" but keep `{string} username`)
  - Only for public APIs or widely reused utilities should you add detailed explanations beyond types
  - Don't overuse JSDoc explanatory text for simple internal functions, but type annotations are always valuable

- ✅ Use structural cues instead of inline comments

  - Group related logic into small, well-named functions instead of scattering `//` explanations

- ⚠️ Outdated comments are worse than no comments

  - Update or delete comments when behavior changes
  - Treat comments as temporary scaffolding

- ✅ Use these tags with clear reasoning:

  ```js
  // TODO: Improve caching strategy for performance
  // FIXME: Crashes if userId is undefined — validate earlier
  // HACK: Forces layout reflow to fix Safari rendering bug
  ```

- ✅ Example of good vs bad JSDoc and comments:

  ❌ Bad inline comment:

  ```js
  // loop through items
  for (let i = 0; i < items.length; i++) {
  ```

  ✅ Good inline comment:

  ```js
  // Skip first item — it's always a system default placeholder
  for (let i = 1; i < items.length; i++) {
  ```

  ❌ Bad JSDoc (removes valuable type info):

  ```js
  constructor(username, socketId) {
  ```

  ✅ Good JSDoc (keeps types, removes redundant descriptions):

  ```js
  /**
   * @param {string} username
   * @param {string} socketId
   */
  constructor(username, socketId) {
  ```

  ⚠️ Redundant but acceptable (keep the types, description adds little value):

  ```js
  /**
   * @param {string} username - The user's username
   * @param {string} socketId - The socket identifier
   */
  constructor(username, socketId) {
  ```

> Leave comments like you're leaving breadcrumbs for your future self — tired, distracted, and trying to fix a bug.

---

## 📐 Clean Code Principles (Extended)

These additions further support your existing rules by reinforcing clarity, structure, and professionalism.

- ✅ Prefer small, well-named files over large catch-all modules
- ✅ Treat naming as design — the right name removes the need for comments
- ✅ Avoid logic that depends on code execution order across files (prefer explicit wiring)
- ✅ Never sacrifice readability for cleverness — leave “tricks” out of production code
- ✅ Document assumptions through code (default parameters, guard clauses) rather than prose
- ✅ Apply consistent formatting, spacing, and file organization — make the codebase feel clean at a glance
- ✅ Design for the future reader, not just the present task

---

## ✅ Testing Philosophy (Extended)

You already have excellent TDD enforcement. These are additive patterns to encourage thoughtful coverage:

- ✅ Use test names that describe behavior: `itRejectsInvalidEmails()` > `test1()`
- ✅ Keep test setups minimal and descriptive — no deeply nested mocks
- ✅ Use helper functions for common setup to avoid duplication
- ✅ Favor real data and real flow over mocking unless the dependency is external
- ✅ Test edge cases, failure modes, and default fallbacks
- ✅ Don't test internal implementation — test observable outcomes

---

## 🧠 Git Hygiene Philosophy (Expanded Commit Practices)

You already have an excellent commit system. These are mindset additions, not replacements:

- ✅ Every commit should answer: “What changed?” and “Why?”
- ✅ Each commit should be self-contained and pass tests on its own
- ✅ Don't commit “broken in progress” states — use WIP branches locally if needed
- ✅ If you're undoing something, say why: `revert: removes failing state sync — too fragile`
- ✅ Use present tense in commit summaries: “Fix bug” not “Fixed bug”

---

## 🛠 Refactoring Guidance (Extended Mindset)

- ✅ Always refactor with a purpose — don’t move code just to “tidy up” without understanding impact
- ✅ Look for code that’s “almost duplicated” — extract abstraction _only if_ both sides benefit
- ✅ Don’t just rename a class — rethink its responsibility and API
- ✅ If you don’t fully understand the old code, flag it for review (`//legacy:`) instead of guessing
- ✅ Err on the side of safety: comment > delete

---

## Additional Tips to keep in mind

### 🧪 Make Testing a First-Class Citizen

- Think of testing as a design tool, not a chore.
- Design interfaces and logic to be easy to test — small pure functions, predictable side effects.

### 💬 Favor Explicitness Over Implicit “Magic”

- Be obvious about what’s happening — avoid side effects, implicit globals, and hidden dependencies.
- Code should be traceable and debuggable just by reading it.

### 🧠 Model Concepts First, Then Code

- Start with the nouns and verbs of the problem domain.
- Let your code mirror how you'd explain the system to someone else.

### ⛑️ Make Debugging Easy for Future-You

- Leave breadcrumbs: meaningful logs, clear error messages, tight commit history, and helpful comments.
- Assume your future self will be tired and confused when debugging — write for that person.

### 🔄 Design with Change in Mind

- Ask: “If requirements changed tomorrow, how painful would this be to modify?”
- Prefer clear seams and interfaces that are easy to adapt.

## 🧠 Context-Aware Task Execution & Decomposition

Claude must automatically detect when a requested task exceeds its context window.

When this happens:

1. **Do not attempt the task outright.**

   - Claude must **stop immediately** — no partial results, no speculative answers.
   - It must **never silently truncate output** or pretend to complete what it cannot fully process.

2. **Decompose the task into smaller, context-fit subtasks.**

   - Each subtask must be independently manageable within Claude’s working memory.
   - Subtasks must be sequential and clearly labeled (e.g., “Step 1 of 4”).
   - Claude should output a message like:  
     _“This task is too large for my context window. I’ve broken it into the following manageable steps:”_  
     followed by a numbered list.

3. **Pause after each step for user confirmation.**

   - After finishing each subtask, Claude must prompt:
     _“Would you like to proceed to the next step?”_  
     or allow the user to reply simply with `continue`.

4. **Summarize all completed work at the end.**

   - Provide a concise recap of what was done across all steps.
   - Make sure the user can clearly verify that the full task has been handled.

5. **Clarify decisions upon request.**
   - If asked, Claude must be ready to explain:
     - Why the task was split this way
     - How subtasks were chosen or ordered

Design Intent:

- This decomposition protocol is **mandatory** for large or ambiguous prompts.
- Claude must prioritize traceability and trust:
  - It should be obvious **why** work was paused
  - The user should always be in control of pacing
  - Each step must be complete, isolated, and context-safe

🧠 Commit Granularity Analysis
To ensure every proposed commit supports meaningful review and traceability:

After suggesting a commit or a grouped commit plan, always explain the reasoning behind the commit boundaries.

This explanation must follow the human-readable commit summary and appear before waiting for feedback.

Include one of the following:

✅ A justification for keeping all changes in a single commit (e.g., because they are tightly coupled, impossible to separate without breaking tests, or all refactor a single concept)

✅ A suggested breakdown if the changes could be clearer in multiple commits:

Example: one commit per module or file

Example: one for logic, one for tests

Example: one to refactor or rename, then another to add new functionality

The goal is to make commit history as readable and intentional as the code itself — every commit should tell a clean, self-contained story.
