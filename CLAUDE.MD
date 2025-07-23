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
- **CRITICAL**: When you encounter code that expects properties or methods that don't exist in the actual class definitions:

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
  - Only use mock objects when testing external dependencies (APIs, databases, file systems) or when testing error conditions that are difficult to reproduce with real objects
  - **CRITICAL**: Before writing tests, analyze the actual class definitions and how they're used in the codebase:

    - Read the actual class files to understand their real structure and properties
    - Search for how objects are created and used throughout the codebase
    - Never assume a class has properties that aren't in its constructor unless you verify they're added dynamically
    - If you find a mismatch between class definitions and usage, fix the code that has the architectural problem, not the tests

  - When a class expects certain properties that don't exist in the class definition, this indicates a design issue that should be resolved rather than worked around in tests
  - **CRITICAL**: Always use the actual class behavior in tests - never manually override class properties unless specifically testing that override behavior:

    - If a class constructor automatically generates IDs, use those auto-generated IDs in tests
    - Don't manually set properties like `object.id = "test123"` unless that's the actual behavior being tested
    - Let constructors run their full initialization logic and use the results
    - Only override auto-generated values when testing specific edge cases or when the test requires predictable values for assertions
  - Tests must follow the DRY principle
  - Tests must test the real code, not reimplemented logic
  - Never omit this unless explicitly told to skip tests for this task
  - Prioritize code readability over performance optimization
  - Run all tests before suggesting changes
  - All new code must not break previous tests
  - I want you to follow Test-Driven Development (TDD) strictly, in a Red-Green-Refactor loop.

    - Red: Write a failing unit test for a small piece of functionality.
    - Green: Write the minimal code needed to make that test pass.
    - Refactor: Clean up both the test and the implementation, improving readability, removing duplication, etc., without changing behavior.
      After you finish one cycle, repeat for the next bit of functionality.

## Code Documentation Guidelines

### Comment Philosophy

Write comments as if you're explaining the code to yourself 6 months from now when you've forgotten everything about this project.

**Comment every line of code** using the following rules:

- Break the code into logical **sections** (functions, blocks, loops)
- Match the **tone and style** of existing comments
- Use **lowercase** unless required (e.g. names, acronyms)
- **No space after `//`** — write `//comment`, not `// comment`
- Be **informal and direct**, like you're jotting a note to yourself
- Focus on **what the line does** and **why it exists**
- Skip restating obvious syntax (e.g. `let x = 5`) unless the reason isn’t clear
- Call out **side effects, assumptions, and potential gotchas**

After making any code change, output a commit message the user can copy and paste into Git.

### Format

Use the following structure:

```
<type>: <short summary>

<detailed explanation, if needed>
```

### Guidelines

- Use Conventional Commit types:

  - `feat:` for new features
  - `fix:` for bug fixes
  - `refactor:` for code reorganization without behavior changes
  - `test:` for test updates or additions
  - `docs:` for documentation updates
  - `chore:` for non-code updates like configs or scripts

- Use bullet points (`-`) for multiple changes in the body
- Be concise but clear — like you're explaining it to future you or a teammate
- Only generate **one commit message** per logical change

### Commit Workflow for Complex Tasks

- If a task requires **multiple changes**, **split the work into small, focused commits**, unless the changes are interdependent.

  - If the changes depend on each other and must land together to avoid broken functionality, include them in the same commit.
  - Each commit must not break the codebase and should represent a working state.
  - Use a clear [Conventional Commit](https://www.conventionalcommits.org/) message for each commit.

- Example of the kind of commit message I want:

```
feat: add SessionManager and chess color assignment module

Replace Database with better-named SessionManager and extract color logic

## SessionManager.js (replaces Database.js)
- Renamed "Database" to "SessionManager" for clearer purpose (it's not actually a database)
- Cleaner method names: addSession() vs createSession(), removeSession() vs deleteSession()
- Removed game-specific logic - now focused purely on session/player management
- Same core functionality: manages gameSessions, connectedPlayers, and socketIDtoGameSessionID mappings

## chessColorAssignment.js (extracted logic)
- Extracts color assignment logic that was previously duplicated across multiple classes
- Follows chess convention: first player gets black, second gets white
- Handles edge cases (null/undefined players gracefully)
- Separates chess-specific game rules from networking layer for better modularity
- Makes color logic reusable and easily testable in isolation
- Sets foundation for future games to have their own team assignment modules

## Why this refactor?
Before: Color assignment logic duplicated in Database.js, GameSession.js, and GameInstance.js
After: Clean separation - SessionManager handles networking, chessColorAssignment handles game rules

Files to stage for this commit:
git add backend/gameSetup/SessionManager.js
git add backend/gameLogic/chessColorAssignment.js
git add tests/SessionManager.test.js
git add tests/chessColorAssignment.test.js
```

- Instead of committing immediately:

  - **Make only the first change**
  - **Stage only the files involved in that single change**
  - Output:

    - The filenames that were staged
    - The commit message you would use
    - A short summary of what changed

  - Then **pause and wait for feedback**

- I will manually review the change, give feedback, and run:

  ```bash
  git add .
  git commit -m "your commit message"
  git push
  ```

- Only after I confirm that the change is accepted, you can continue with the **next small change**, and repeat the process.

- Never bundle multiple unrelated changes into one commit.

- Never move on to the next task without confirmation.

- In each reply to me you must also give me a seperate analysis of all yor changes explaining the reasoning and thought process behind each change

- In your responses, do NOT write 🤖 Generated with [Claude Code](https://claude.ai/code) Co-Authored-By: Claude [noreply@anthropic.com](mailto:noreply@anthropic.com)
