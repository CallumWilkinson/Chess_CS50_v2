# Simplicity Addendum

## Purpose

Reinforce a simplicity-first approach. Default to the smallest workable solution before introducing new abstractions.

## Precedence

These rules take precedence over Codex on abstraction decisions.

## Meaningful State

Meaningful state is data that changes over time and affects domain rules or outcomes. Cache handles, config blobs, injected clients, or framework references are not meaningful state.

## Core Rules

1. Prefer functions until logic is repeated three times. Only then extract.
2. Create a class only if both conditions hold:

   - It holds meaningful state.
   - It provides domain behavior tied to that state.

3. No inheritance. Use composition.
4. No extra layers unless a concrete requirement forces it. Controller is allowed only at framework boundaries, never in core domain.
5. One new class maximum per task. The default is none.
6. Two new files maximum per task.

## Promotion Lifecycle

Move up in small steps.

- **Stage A**: free function.
- **Stage B**: module of functions that share a data shape.
- **Stage C**: class. Use only if the Simplicity gates approve it.

Output must state the current stage and why a higher stage is required now.

## Naming Rules

- Allowed: plain domain nouns like `GameSession` or `MoveValidator`.
- Allow-listed roles: `Entity`, `ValueObject`, `Policy`, `Adapter`, `Repository`, `Coordinator`, `Controller` at boundaries only.
- Disallowed or suspect: `*Manager`, `*Service`, `*Helper`, `*Util`, `*Base`, `*Factory`, `*Engine`, `*Core`, `*Lifecycle`, `*Controller` in core domain.
- If a disallowed name is proposed, supply a simpler allow-listed alternative and explain why the simple option fails now.

## Abstraction Gate

Every new class or layer must include this in the PR description.

1. **Role**: choose one of Entity, ValueObject, Policy, Adapter, Repository, Coordinator.
2. **Responsibility**: complete the sentence, this class is responsible for …
3. **Why not simpler**: explain why a function or existing class is not enough. Include the exact call site that would break.
4. **Meaningful state fields**: list them and explain how they affect behavior.
5. **Usage-first sample**: show 5 to 10 lines of real usage before implementation.
6. **Public surface**: list public methods with one line each.
7. **Alternatives rejected**: name at least one simpler option and why it fails now.
8. **Tests**: link to the minimal passing tests that prove the need.

If any answer is weak, reject the class or demote the idea to functions.

## Class Health Rubric

Score the proposal from 0 to 5.

- Owns meaningful state: 0 or 1.
- Exposes cohesive behavior tied to that state: 0 or 1.
- Fewer than four public methods: 0 or 1.
- No IO in constructors and no hidden globals: 0 or 1.
- Replaces real duplication, not hypothetical reuse: 0 or 1.

Classes that score below 4 are rejected.

## Public Surface Budget

A new class starts with at most three public methods, one constructor, and at most one factory helper. Expanding this requires tests and a short justification.

## Class Creation Checklist

Before adding a class, answer:

- Responsibility: this class is responsible for …
- Why not a function or an existing class
- What state it owns, list fields
- Where it is used today, show a usage snippet

If any answer is weak, do not create the class.

## Output Requirements

When suggesting new structure, include:

- A usage-first example that shows how it is called before the implementation.
- A Why not simpler note that rejects at least one simpler option.
- A file plan that lists files touched and new files or classes.

## Refactoring Triggers

- Extract only after the third duplication.
- Extract at two duplicates only if the rule is safety-critical or cross-cutting and you show likely divergence.
- Keep temporary duplication during Red and Green. Fold on Refactor.
- Inline abstractions that just forward calls or store no meaningful state.
- Collapse layers that do not add domain rules.

## Red Flags

Treat these as errors unless fully justified:

- Empty constructors.
- Classes with only getters and setters.
- Classes that only pass data between two others.
- Abstract classes or interfaces with fewer than two real implementations.
- Coordination classes that do not encapsulate a domain policy.

## Pull Request Template

Use this template to make decisions visible.

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

## Example: Bad vs Better

**Bad proposal**

```js
//js
class SessionLifecycleService {
  constructor(sessionStore, clock) {}
  start(session) {}
  stop(session) {}
  restart(session) {}
}
```

Fails the gate. Role not in allow-list. No meaningful state. Methods forward to others. Name hides behavior.

**Better replacement**

```js
//js
export class GameSession {
  constructor(id, players = [], status = "pending", startedAt = null) {
    this.id = id;
    this.players = players;
    this.status = status;
    this.startedAt = startedAt;
  }

  start(clock, policy) {
    if (!policy.canStart(this)) return false;
    this.status = "active";
    this.startedAt = clock.now();
    return true;
  }
}

export class SessionTimingPolicy {
  canStart(session) {
    return session.players.length >= 2 && session.status === "pending";
  }
}

//usage-first example
//js
import { GameSession } from "./gameSession.js";
import { SessionTimingPolicy } from "./sessionTimingPolicy.js";

const session = new GameSession("s1");
session.players.push({ id: "a" }, { id: "b" });
const started = session.start(
  { now: () => Date.now() },
  new SessionTimingPolicy()
);
//started is true, session.status is "active"
```

**Analogy**

Policies are recipe cards, they sit flat in a drawer and never plug into the wall. Adapters are power boards at the edge. Entities are the appliances that actually cook.

---
