# Claude Code Configuration

## Development Guidelines

- Follow existing project formatting and naming conventions
- Avoid ternary operators – use explicit if/else statements
- Write unit tests for all new functions and modified logic
- Run all tests before committing changes
- Follow TDD approach: write failing test, implement code, refactor
- Prioritize code readability over performance optimization
- Use `await` with `try/catch` blocks instead of `.then()` for async JavaScript
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

<type>: <short summary>

<detailed explanation, if needed>

### Guidelines

- Use Conventional Commit types:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `refactor:` for code reorganization without behavior changes
  - `test:` for test updates or additions
  - `docs:` for documentation updates
  - `chore:` for non-code updates like configs or scripts
- Use bullet points () for multiple changes in the body
- Be concise but clear — like you're explaining it to future you or a teammate
- Only generate **one commit message** per logical change
