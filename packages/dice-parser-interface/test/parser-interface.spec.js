import { describe, it, expect, beforeEach } from 'vitest'
import ParserInterface from '../src/ParserInterface'

let DP
beforeEach(() => {
  DP = new ParserInterface()
})

describe('ParserInterface basic behavior', () => {
  it('clear() resets state', () => {
    DP.rollsAsFloats.push(0.5)
    DP.dieGroups.push({ qty: 1 })
    DP.parsedNotation = {}
    DP.finalResults = {}
    DP.clear()
    expect(DP.rollsAsFloats).toEqual([])
    expect(DP.dieGroups).toEqual([])
    expect(DP.parsedNotation).toBeNull()
    expect(DP.finalResults).toBeNull()
  })

  it('parseNotation parses simple 4d6', () => {
    const dies = DP.parseNotation('4d6')
    expect(Array.isArray(dies)).toBe(true)
    expect(dies[0].qty).toBe(4)
    expect(dies[0].sides).toBe(6)
  })

  it('incrementId increments composite ids', () => {
    expect(DP.incrementId('2')).toBe('2.1')
    expect(DP.incrementId('2.1')).toBe('2.2')
  })

  it('recursiveSearch finds nested keys', () => {
    const obj = { a: { die: 1, x: { die: 2 } }, b: { c: { die: 3 } } }
    const found = DP.recursiveSearch(obj, 'die')
    expect(found.sort()).toEqual([1,2,3].sort())
  })

  it('handleTargetCritSuccess adds extra success when enabled', () => {
    const finalResults = { rolls: [{ successes: 1, critical: 'success' }], value: 0 }
    DP.targetRollsCritSuccess = true
    DP.handleTargetCritSuccess(finalResults)
    expect(finalResults.rolls[0].successes).toBe(2)
    expect(finalResults.value).toBe(1)
  })

  it('handleTargetCritFailure adds extra failure when enabled', () => {
    const finalResults = { rolls: [{ failures: 1, critical: 'failure' }], value: 0 }
    DP.targetRollsCritFailure = true
    DP.handleTargetCritFailure(finalResults)
    expect(finalResults.rolls[0].failures).toBe(2)
    expect(finalResults.value).toBe(-1)
  })

  describe('handleRerolls', () => {
    it('detects explode and returns reroll objects', () => {
      const groups = [
        {
          mods: [{ type: 'explode', target: { value: { value: 6 }, mod: '>' } }],
          rolls: [ { sides: 6, value: 6, rollId: '0' }, { sides: 6, value: 1, rollId: '1' } ]
        }
      ]
      const rerolls = DP.handleRerolls(groups)
      expect(rerolls).toEqual([{ groupId: 0, rollId: '0.1', sides: 6, qty: 1 }])
    })

    it('handles rerollOnce and respects existing decimals', () => {
      const groups = [
        {
          mods: [{ type: 'rerollOnce', target: { mod: '<', value: { value: 2 } } }],
          rolls: [ { sides: 10, value: 1, rollId: '2' }, { sides: 10, value: 3, rollId: '3.1' } ]
        }
      ]
      const rerolls = DP.handleRerolls(groups)
      expect(rerolls).toEqual([{ groupId: 0, rollId: '2.1', sides: 10, qty: 1 }])
    })

    it('handles penetrate (treated like explode) and returns reroll', () => {
      const groups = [
        {
          mods: [{ type: 'penetrate', target: { value: { value: 6 }, mod: '=' } }],
          rolls: [ { sides: 6, value: 6, rollId: '0' } ]
        }
      ]
      const rerolls = DP.handleRerolls(groups)
      expect(rerolls).toEqual([{ groupId: 0, rollId: '0.1', sides: 6, qty: 1 }])
    })
  })

  describe('parseFinalResults', () => {
    it('converts rollResults to floats and calls rollParser, then clears state', () => {
      // create a rollResults with one roll at max
      const rollResults = { rolls: { 0: { sides: 6, value: 6 } } }
      DP.parsedNotation = { dummy: true }
      // stub the parser result
      DP.rollParser.rollParsed = () => ({ success: null, rolls: [], value: 0 })

      const final = DP.parseFinalResults(rollResults)
      expect(final).toEqual({ success: null, rolls: [], value: 0 })
      // rollsAsFloats should be cleared after parsing
      expect(DP.rollsAsFloats).toEqual([])
      expect(DP._externalCount).toBe(0)
    })

    it('applies target crit success/failure when flags enabled', () => {
      const rollResults = { rolls: { 0: { sides: 6, value: 6 } } }
      DP.parsedNotation = { dummy: true }
      DP.rollParser.rollParsed = () => ({ success: 1, rolls: [{ successes: 1, critical: 'success' }], value: 0 })

      DP.targetRollsCritSuccess = true
      const final = DP.parseFinalResults(rollResults)
      expect(final.rolls[0].successes).toBe(2)
      expect(final.value).toBe(1)

      DP.targetRollsCritSuccess = false
      DP.targetRollsCritFailure = true
      DP.rollParser.rollParsed = () => ({ success: 1, rolls: [{ failures: 1, critical: 'failure' }], value: 0 })
      const finalFail = DP.parseFinalResults(rollResults)
      expect(finalFail.rolls[0].failures).toBe(2)
      expect(finalFail.value).toBe(-1)
    })

    it('recursiveSearch invokes callback for each found key', () => {
      const obj = { a: { die: 1, x: { die: 2 } }, b: { c: { die: 3 } } }
      const calls = []
      const cb = (o) => calls.push(o)
      DP.recursiveSearch(obj, 'die', [], cb)
      // callback should have been called once per die found (3)
      expect(calls.length).toBe(3)
      // callback items should include objects that have the 'die' key
      calls.forEach(o => expect(Object.prototype.hasOwnProperty.call(o, 'die')).toBeTruthy())
    })

    it('rollNotation forwards to rollParser.rollParsed', () => {
      const expected = { foo: 'bar' }
      DP.rollParser = { rollParsed: (notation) => expected }
      const result = DP.rollNotation({})
      expect(result).toBe(expected)
    })
  })
})
