# 007 — ParserInterface: TODOs and follow-ups

This issue file collects open TODOs found in `packages/dice-parser-interface/src/ParserInterface.js` and suggested fixes, tests, and priorities.

Files: packages/dice-parser-interface/src/ParserInterface.js

Summary of TODOs

1. Toggle target roll crit behavior externally
   - Current: flags `targetRollsCritSuccess` and `targetRollsCritFailure` are set via constructor options. There's a TODO to provide a public toggle API.
   - Suggested fix: Add methods `enableTargetCrits({ success, failure })` or properties with setters and tests.
   - Tests: ensure toggling at runtime affects `parseFinalResults` behavior (unit tests already partially present).

2. `handleRerolls` return shape and coverage
   - Current: TODO states the method should return an object of rerolls to be rolled again.
   - Suggested fix: standardize returned object shape and document it in README.
   - Tests: add regression tests confirming reroll list format for `explode`, `penetrate`, `reroll`, `rerollOnce`.

3. Handle each mod type consistently
   - Current: code handles some mod types; TODO notes additional handlers may be required.
   - Suggested fix: Audit Roll20 modifiers and add handler functions per modifier with unit tests.

4. Pass back die metadata (theme etc.) on rerolls
   - Current: reroll objects only contain `groupId`, `rollId`, `sides`, `qty`.
   - Suggested fix: include `theme` and other relevant die properties for UI-consumption.
   - Tests: verify reroll objects include `theme` when available.

5. Destructure die objects for reroll generation
   - Current: TODO suggests replacing `rollId` while preserving other properties.
   - Suggested fix: shallow-copy die object and set new `rollId`, returning the updated object with preserved keys.
   - Tests: ensure keys like `scale` or `theme` survive the transformation.

6. Explode beyond first roll being dropped
   - Current: TODO calls out an actual bug where compound/penetrate explosions beyond first are dropped (likely due to value decrements).
   - Suggested fix: write failing tests that reproduce the bug, then implement fix (likely requires re-evaluating successTest criteria and reroll chain handling).
   - Tests: end-to-end reproduction test that produces >1 chained explosion and asserts rerolls contain the chain.

Priority & plan
- High: (6) add regression tests for the explosion chaining bug and (2) standardize reroll output shape. These are regressions affecting correctness.
- Medium: (1) add a public toggle API for target crits and add tests.
- Low: metadata preservation and destructuring improvements.

Notes
- Where possible add tests that assert current behavior (regression) before implementing fixes.
- Keep changes minimal and well-covered by tests.

If you want I can continue with implementing fixes prioritized as above — tell me whether to start with tests only (create failing tests for the explosion bug) or implement both tests and fixes.