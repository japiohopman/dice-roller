# Dice Parser Interface

Lightweight interface between `@3d-dice/dice-roller-parser` and `dice-box`.

Install:

```bash
npm install @3d-dice/dice-parser-interface
```

Usage:

```js
import DiceParser from '@3d-dice/dice-parser-interface'
const DP = new DiceParser()

// parse notation
const groups = DP.parseNotation('4d6')

// after rolling with dice-box, compute final results
const final = DP.parseFinalResults(resultsFromDiceBox)
```

See `src/ParserInterface.js` for details on supported methods and behaviour.
