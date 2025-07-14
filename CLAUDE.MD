# Claude Code Configuration

## Development Guidelines

- Follow existing project formatting and naming conventions
- Use ES6 `class` syntax and organize logic using object-oriented principles
- Use ECMAScript modules (`import` / `export`) only — do not use CommonJS (`require`)
- Avoid ternary operators – use explicit `if/else` statements for clarity
- Use `await` with `try/catch` blocks instead of `.then()` for async JavaScript
- Write clean, modular code where each file or class has a single responsibility
- Never rely on “magic” behavior — everything should be traceable and explicit
- You must write a unit test for every new function or logic change. This is not optional.
  - If a test is not included, clearly explain _why it cannot or should not be tested_
  - Place the test in a dedicated `__tests__` or `*.test.js` file, following the existing test structure
  - Use `jest` syntax for all test code
  - If modifying existing logic, update or extend the relevant test
  - Tests must run independently and use mock data or mocks where needed
  - Tests must follow the DRY principle
  - Never omit this unless explicitly told to skip tests for this task
- Run all tests before committing changes
- Follow TDD approach: write failing test, implement code, refactor
- Prioritize code readability over performance optimization
- Environment: Windows 11, PowerShell, VS Code

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

### Commit Breakdown for Complex Tasks

- If the task is **non-trivial or involves multiple steps** (e.g. modifying logic, adding a feature, writing tests, refactoring, updating docs), **split the work into small, focused commits**
- Each commit must:
  - Do only **one logical change**
  - Include a **clear Conventional Commit message** explaining _only that change_
  - Be easy to review and revert if needed
- When in doubt, use the rule: **1 commit per change, per file or function**
- Examples of commit separation:
  - `feat: add validation for pawn movement`
  - `test: add unit tests for pawn move validation`
  - `refactor: move piece logic into separate class`
  - `docs: comment each line in pawn.js`
- Never squash large tasks into one commit unless explicitly told to
- **Do not automatically commit the changes. Just stage them and show me the commit message you would use. I will decide whether or not to commit.**
