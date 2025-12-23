import {
  __commonJS,
  __publicField,
  __toESM
} from "./chunk-EQCVQC35.js";

// node_modules/@3d-dice/dice-roller-parser/dist/index.js
var require_dist = __commonJS({
  "node_modules/@3d-dice/dice-roller-parser/dist/index.js"(exports, module) {
    !function(e, r) {
      if ("object" == typeof exports && "object" == typeof module) module.exports = r();
      else if ("function" == typeof define && define.amd) define([], r);
      else {
        var t = r();
        for (var l in t) ("object" == typeof exports ? exports : e)[l] = t[l];
      }
    }(exports, () => (() => {
      "use strict";
      var e = { 95: (e2, r2, t) => {
        Object.defineProperty(r2, "__esModule", { value: true }), r2.DiceRoller = void 0;
        const l = t(51);
        r2.DiceRoller = class {
          constructor(e3, r3 = 1e3) {
            this.randFunction = Math.random, this.maxRollCount = 1e3, e3 && (this.randFunction = e3), this.maxRollCount = r3;
          }
          parse(e3) {
            return l.parse(e3);
          }
          roll(e3) {
            const r3 = l.parse(e3);
            return this.rollType(r3);
          }
          rollValue(e3) {
            return this.roll(e3).value;
          }
          rollParsed(e3) {
            return this.rollType(e3);
          }
          rollType(e3) {
            let r3;
            switch (e3.type) {
              case "diceExpression":
                r3 = this.rollDiceExpr(e3);
                break;
              case "group":
                r3 = this.rollGroup(e3);
                break;
              case "die":
                r3 = this.rollDie(e3);
                break;
              case "expression":
                r3 = this.rollExpression(e3);
                break;
              case "mathfunction":
                r3 = this.rollFunction(e3);
                break;
              case "inline":
                r3 = this.rollType(e3.expr);
                break;
              case "number":
                r3 = Object.assign(Object.assign({}, e3), { success: null, successes: 0, failures: 0, valid: true, order: 0 });
                break;
              default:
                throw new Error(`Unable to render ${e3.type}`);
            }
            return e3.label && (r3.label = e3.label), r3;
          }
          rollDiceExpr(e3) {
            const r3 = this.rollType(e3.head), t2 = [r3], l2 = [], o = e3.ops.reduce((e4, r4, o2) => {
              const s = this.rollType(r4.tail);
              switch (s.order = o2, t2.push(s), l2.push(r4.op), r4.op) {
                case "+":
                  return e4 + s.value;
                case "-":
                  return e4 - s.value;
                default:
                  return e4;
              }
            }, r3.value);
            return { dice: t2, ops: l2, success: null, successes: 0, failures: 0, type: "diceexpressionroll", valid: true, value: o, order: 0 };
          }
          rollGroup(e3) {
            let r3 = e3.rolls.map((e4, r4) => Object.assign(Object.assign({}, this.rollType(e4)), { order: r4 })), t2 = 0, l2 = 0, o = false;
            if (e3.mods) {
              const s2 = e3.mods, n = (e4) => (o = s2.some((e5) => ["failure", "success"].includes(e5.type)), e4 = s2.reduce((e5, r4) => this.applyGroupMod(e5, r4), e4), o && (e4 = e4.map((e5) => (t2 += e5.successes, l2 += e5.failures, e5.value = e5.successes - e5.failures, e5.success = e5.value > 0, e5))), e4);
              if (1 === r3.length && ["die", "diceexpressionroll"].includes(r3[0].type)) {
                const e4 = r3[0];
                let t3 = "die" === e4.type ? e4.rolls : e4.dice.filter((e5) => "number" !== e5.type).reduce((e5, r4) => [...e5, ..."die" === r4.type ? r4.rolls : r4.dice], []);
                t3 = n(t3), e4.value = t3.reduce((e5, r4) => r4.valid ? e5 + r4.value : e5, 0);
              } else r3 = n(r3);
            }
            const s = r3.reduce((e4, r4) => r4.valid ? e4 + r4.value : e4, 0);
            return { dice: r3, success: o ? s > 0 : null, successes: t2, failures: l2, type: "grouproll", valid: true, value: s, order: 0 };
          }
          rollDie(e3) {
            const r3 = this.rollType(e3.count);
            if (r3.value > this.maxRollCount) throw new Error("Entered number of dice too large.");
            let t2, l2;
            "fate" === e3.die.type ? (l2 = { type: "fate", success: null, successes: 0, failures: 0, valid: false, value: 0, order: 0 }, t2 = Array.from({ length: r3.value }, (e4, r4) => this.generateFateRoll(r4))) : (l2 = this.rollType(e3.die), t2 = Array.from({ length: r3.value }, (e4, r4) => this.generateDiceRoll(l2.value, r4))), e3.mods && (t2 = e3.mods.reduce((e4, r4) => this.applyMod(e4, r4), t2));
            let o = 0, s = 0;
            e3.targets && (t2 = e3.targets.reduce((e4, r4) => this.applyMod(e4, r4), t2).map((e4) => (o += e4.successes, s += e4.failures, e4.value = e4.successes - e4.failures, e4.success = e4.value > 0, e4)));
            let n = false, u = 0;
            if (e3.match) {
              const r4 = e3.match, l3 = t2.reduce((e4, r5) => e4.set(r5.roll, (e4.get(r5.roll) || 0) + 1), /* @__PURE__ */ new Map()), o2 = new Set(Array.from(l3.entries()).filter(([e4, t3]) => t3 >= r4.min.value).filter(([e4]) => !(r4.mod && r4.expr) || this.successTest(r4.mod, this.rollType(r4.expr).value, e4)).map(([e4]) => e4));
              t2.filter((e4) => o2.has(e4.roll)).forEach((e4) => e4.matched = true), r4.count && (n = true, u = o2.size);
            }
            e3.sort && (t2 = this.applySort(t2, e3.sort));
            const a = t2.reduce((e4, r4) => r4.valid ? e4 + r4.value : e4, 0);
            return { count: r3, die: l2, rolls: t2, success: e3.targets ? a > 0 : null, successes: o, failures: s, type: "die", valid: true, value: n ? u : a, order: 0, matched: n };
          }
          rollExpression(e3) {
            const r3 = this.rollType(e3.head), t2 = [r3], l2 = [], o = e3.ops.reduce((e4, r4) => {
              const o2 = this.rollType(r4.tail);
              switch (t2.push(o2), l2.push(r4.op), r4.op) {
                case "+":
                  return e4 + o2.value;
                case "-":
                  return e4 - o2.value;
                case "*":
                  return e4 * o2.value;
                case "/":
                  return e4 / o2.value;
                case "%":
                  return e4 % o2.value;
                case "**":
                  return e4 ** o2.value;
                default:
                  return e4;
              }
            }, r3.value);
            return { dice: t2, ops: l2, success: null, successes: 0, failures: 0, type: "expressionroll", valid: true, value: o, order: 0 };
          }
          rollFunction(e3) {
            const r3 = this.rollType(e3.expr);
            let t2;
            switch (e3.op) {
              case "floor":
                t2 = Math.floor(r3.value);
                break;
              case "ceil":
                t2 = Math.ceil(r3.value);
                break;
              case "round":
                t2 = Math.round(r3.value);
                break;
              case "abs":
                t2 = Math.abs(r3.value);
                break;
              default:
                t2 = r3.value;
            }
            return { expr: r3, op: e3.op, success: null, successes: 0, failures: 0, type: "mathfunction", valid: true, value: t2, order: 0 };
          }
          applyGroupMod(e3, r3) {
            return this.getGroupModMethod(r3)(e3);
          }
          getGroupModMethod(e3) {
            const r3 = (e4) => e4.value;
            switch (e3.type) {
              case "success":
                return this.getSuccessMethod(e3, r3);
              case "failure":
                return this.getFailureMethod(e3, r3);
              case "keep":
                return this.getKeepMethod(e3, r3);
              case "drop":
                return this.getDropMethod(e3, r3);
              default:
                throw new Error(`Mod ${e3.type} is not recognised`);
            }
          }
          applyMod(e3, r3) {
            return this.getModMethod(r3)(e3);
          }
          getModMethod(e3) {
            const r3 = (e4) => e4.roll;
            switch (e3.type) {
              case "success":
                return this.getSuccessMethod(e3, r3);
              case "failure":
                return this.getFailureMethod(e3, r3);
              case "crit":
                return this.getCritSuccessMethod(e3, r3);
              case "critfail":
                return this.getCritFailureMethod(e3, r3);
              case "keep":
                return (t2) => this.getKeepMethod(e3, r3)(t2).sort((e4, r4) => e4.order - r4.order);
              case "drop":
                return (t2) => this.getDropMethod(e3, r3)(t2).sort((e4, r4) => e4.order - r4.order);
              case "explode":
                return this.getExplodeMethod(e3);
              case "compound":
                return this.getCompoundMethod(e3);
              case "penetrate":
                return this.getPenetrateMethod(e3);
              case "reroll":
                return this.getReRollMethod(e3);
              case "rerollOnce":
                return this.getReRollOnceMethod(e3);
              default:
                throw new Error(`Mod ${e3.type} is not recognised`);
            }
          }
          applySort(e3, r3) {
            return e3.sort((e4, t2) => r3.asc ? e4.roll - t2.roll : t2.roll - e4.roll), e3.forEach((e4, r4) => e4.order = r4), e3;
          }
          getCritSuccessMethod(e3, r3) {
            const t2 = this.rollType(e3.expr);
            return (l2) => l2.map((l3) => {
              if (!l3.valid) return l3;
              if ("roll" !== l3.type) return l3;
              if (l3.success) return l3;
              const o = l3;
              return this.successTest(e3.mod, t2.value, r3(l3)) ? o.critical = "success" : "success" === o.critical && (o.critical = null), l3;
            });
          }
          getCritFailureMethod(e3, r3) {
            const t2 = this.rollType(e3.expr);
            return (l2) => l2.map((l3) => {
              if (!l3.valid) return l3;
              if ("roll" !== l3.type) return l3;
              if (l3.success) return l3;
              const o = l3;
              return this.successTest(e3.mod, t2.value, r3(l3)) ? o.critical = "failure" : "failure" === o.critical && (o.critical = null), l3;
            });
          }
          getSuccessMethod(e3, r3) {
            const t2 = this.rollType(e3.expr);
            return (l2) => l2.map((l3) => l3.valid ? (this.successTest(e3.mod, t2.value, r3(l3)) && (l3.successes += 1), l3) : l3);
          }
          getFailureMethod(e3, r3) {
            const t2 = this.rollType(e3.expr);
            return (l2) => l2.map((l3) => l3.valid ? (this.successTest(e3.mod, t2.value, r3(l3)) && (l3.failures += 1), l3) : l3);
          }
          getKeepMethod(e3, r3) {
            const t2 = this.rollType(e3.expr);
            return (l2) => {
              if (0 === l2.length) return l2;
              l2 = l2.sort((t3, l3) => "l" === e3.highlow ? r3(l3) - r3(t3) : r3(t3) - r3(l3)).sort((e4, r4) => (e4.valid ? 1 : 0) - (r4.valid ? 1 : 0));
              const o = Math.max(Math.min(t2.value, l2.length), 0);
              let s = 0, n = 0;
              const u = l2.reduce((e4, r4) => (r4.valid ? 1 : 0) + e4, 0) - o;
              for (; n < l2.length && s < u; ) l2[n].valid && (l2[n].valid = false, l2[n].drop = true, s++), n++;
              return l2;
            };
          }
          getDropMethod(e3, r3) {
            const t2 = this.rollType(e3.expr);
            return (l2) => {
              l2 = l2.sort((t3, l3) => "h" === e3.highlow ? r3(l3) - r3(t3) : r3(t3) - r3(l3));
              const o = Math.max(Math.min(t2.value, l2.length), 0);
              let s = 0, n = 0;
              for (; n < l2.length && s < o; ) l2[n].valid && (l2[n].valid = false, l2[n].drop = true, s++), n++;
              return l2;
            };
          }
          getExplodeMethod(e3) {
            const r3 = e3.target ? this.rollType(e3.target.value) : null;
            return (t2) => {
              const l2 = r3 ? (t3) => this.successTest(e3.target.mod, r3.value, t3.roll) : (e4) => this.successTest("=", "fateroll" === e4.type ? 1 : e4.die, e4.roll);
              if ("roll" === t2[0].type && l2({ roll: 1 }) && l2({ roll: t2[0].die })) throw new Error("Invalid reroll target");
              for (let e4 = 0; e4 < t2.length; e4++) {
                let r4 = t2[e4];
                r4.order = e4;
                let o = 0;
                for (; l2(r4) && o++ < 1e3; ) {
                  r4.explode = true;
                  const l3 = this.reRoll(r4, ++e4);
                  t2.splice(e4, 0, l3), r4 = l3;
                }
              }
              return t2;
            };
          }
          getCompoundMethod(e3) {
            const r3 = e3.target ? this.rollType(e3.target.value) : null;
            return (t2) => {
              const l2 = r3 ? (t3) => this.successTest(e3.target.mod, r3.value, t3.roll) : (e4) => this.successTest("=", "fateroll" === e4.type ? 1 : e4.die, e4.roll);
              if ("roll" === t2[0].type && l2({ roll: 1 }) && l2({ roll: t2[0].die })) throw new Error("Invalid reroll target");
              for (let e4 = 0; e4 < t2.length; e4++) {
                let r4 = t2[e4], o = r4.roll, s = 0;
                for (; l2(r4) && s++ < 1e3; ) {
                  r4.explode = true;
                  const t3 = this.reRoll(r4, e4 + 1);
                  o += t3.roll, r4 = t3;
                }
                t2[e4].value = o, t2[e4].roll = o;
              }
              return t2;
            };
          }
          getPenetrateMethod(e3) {
            const r3 = e3.target ? this.rollType(e3.target.value) : null;
            return (t2) => {
              const l2 = r3 ? (t3) => this.successTest(e3.target.mod, r3.value, t3.roll) : (e4) => this.successTest("=", "fateroll" === e4.type ? 1 : e4.die, e4.roll);
              if (r3 && "roll" === t2[0].type && l2(t2[0]) && this.successTest(e3.target.mod, r3.value, 1)) throw new Error("Invalid reroll target");
              for (let e4 = 0; e4 < t2.length; e4++) {
                let r4 = t2[e4];
                r4.order = e4;
                let o = 0;
                for (; l2(r4) && o++ < 1e3; ) {
                  r4.explode = true;
                  const l3 = this.reRoll(r4, ++e4);
                  l3.value -= 1, t2.splice(e4, 0, l3), r4 = l3;
                }
              }
              return t2;
            };
          }
          getReRollMethod(e3) {
            const r3 = e3.target ? this.successTest.bind(null, e3.target.mod, this.rollType(e3.target.value).value) : this.successTest.bind(null, "=", 1);
            return (e4) => {
              if ("roll" === e4[0].type && r3(1) && r3(e4[0].die)) throw new Error("Invalid reroll target");
              for (let t2 = 0; t2 < e4.length; t2++) for (; r3(e4[t2].roll); ) {
                e4[t2].reroll = true, e4[t2].valid = false;
                const r4 = this.reRoll(e4[t2], t2 + 1);
                e4.splice(++t2, 0, r4);
              }
              return e4;
            };
          }
          getReRollOnceMethod(e3) {
            const r3 = e3.target ? this.successTest.bind(null, e3.target.mod, this.rollType(e3.target.value).value) : this.successTest.bind(null, "=", 1);
            return (e4) => {
              if ("roll" === e4[0].type && r3(1) && r3(e4[0].die)) throw new Error("Invalid reroll target");
              for (let t2 = 0; t2 < e4.length; t2++) if (r3(e4[t2].roll)) {
                e4[t2].reroll = true, e4[t2].valid = false;
                const r4 = this.reRoll(e4[t2], t2 + 1);
                e4.splice(++t2, 0, r4);
              }
              return e4;
            };
          }
          successTest(e3, r3, t2) {
            switch (e3) {
              case ">":
                return t2 >= r3;
              case "<":
                return t2 <= r3;
              default:
                return t2 == r3;
            }
          }
          reRoll(e3, r3) {
            switch (e3.type) {
              case "roll":
                return this.generateDiceRoll(e3.die, r3);
              case "fateroll":
                return this.generateFateRoll(r3);
              default:
                throw new Error(`Cannot do a reroll of a ${e3.type}.`);
            }
          }
          generateDiceRoll(e3, r3) {
            const t2 = parseInt((this.randFunction() * e3).toFixed(), 10) + 1;
            return { critical: t2 === e3 ? "success" : 1 === t2 ? "failure" : null, die: e3, matched: false, order: r3, roll: t2, success: null, successes: 0, failures: 0, type: "roll", valid: true, value: t2 };
          }
          generateFateRoll(e3) {
            const r3 = Math.floor(3 * this.randFunction()) - 1;
            return { matched: false, order: e3, roll: r3, success: null, successes: 0, failures: 0, type: "fateroll", valid: true, value: r3 };
          }
        };
      }, 619: (e2, r2) => {
        Object.defineProperty(r2, "__esModule", { value: true }), r2.DiscordRollRenderer = void 0, r2.DiscordRollRenderer = class {
          render(e3) {
            return this.doRender(e3, true);
          }
          doRender(e3, r3 = false) {
            let t = "";
            switch (e3.type) {
              case "diceexpressionroll":
                t = this.renderGroupExpr(e3);
                break;
              case "grouproll":
                t = this.renderGroup(e3);
                break;
              case "die":
                t = this.renderDie(e3);
                break;
              case "expressionroll":
                t = this.renderExpression(e3);
                break;
              case "mathfunction":
                t = this.renderFunction(e3);
                break;
              case "roll":
                return this.renderRoll(e3);
              case "fateroll":
                return this.renderFateRoll(e3);
              case "number":
                const r4 = e3.label ? ` (${e3.label})` : "";
                return `${e3.value}${r4}`;
              case "fate":
                return "F";
              default:
                throw new Error("Unable to render");
            }
            return e3.valid || (t = "~~" + t.replace(/~~/g, "") + "~~"), r3 ? this.stripBrackets(t) : e3.label ? `(${e3.label}: ${t})` : t;
          }
          renderGroup(e3) {
            const r3 = [];
            for (const t of e3.dice) r3.push(this.doRender(t));
            return r3.length > 1 ? `{ ${r3.join(" + ")} } = ${e3.value}` : `{ ${this.stripBrackets(r3[0])} } = ${e3.value}`;
          }
          renderGroupExpr(e3) {
            const r3 = [];
            for (const t of e3.dice) r3.push(this.doRender(t));
            return r3.length > 1 ? `(${r3.join(" + ")} = ${e3.value})` : r3[0];
          }
          renderDie(e3) {
            const r3 = [];
            for (const t2 of e3.rolls) r3.push(this.doRender(t2));
            let t = `${r3.join(", ")}`;
            ["number", "fate"].includes(e3.die.type) && "number" === e3.count.type || (t += `[*Rolling: ${this.doRender(e3.count)}d${this.doRender(e3.die)}*]`);
            const l = e3.matched ? " Match" + (1 === e3.value ? "" : "es") : "";
            return t += ` = ${e3.value}${l}`, `(${t})`;
          }
          renderExpression(e3) {
            if (e3.dice.length > 1) {
              const r3 = [];
              for (let t = 0; t < e3.dice.length - 1; t++) r3.push(this.doRender(e3.dice[t])), r3.push(e3.ops[t]);
              return r3.push(this.doRender(e3.dice.slice(-1)[0])), r3.push("="), r3.push(e3.value + ""), `(${r3.join(" ")})`;
            }
            return "number" === e3.dice[0].type ? e3.value + "" : this.doRender(e3.dice[0]);
          }
          renderFunction(e3) {
            const r3 = this.doRender(e3.expr);
            return `(${e3.op}${this.addBrackets(r3)} = ${e3.value})`;
          }
          addBrackets(e3) {
            return e3.startsWith("(") || (e3 = `(${e3}`), e3.endsWith(")") || (e3 = `${e3})`), e3;
          }
          stripBrackets(e3) {
            return e3.startsWith("(") && (e3 = e3.substring(1)), e3.endsWith(")") && (e3 = e3.substring(0, e3.length - 1)), e3;
          }
          renderRoll(e3) {
            let r3 = `${e3.roll}`;
            return e3.valid ? e3.success && 1 === e3.value ? r3 = `**${e3.roll}**` : e3.success && -1 === e3.value ? r3 = `*${e3.roll}*` : e3.success || "success" !== e3.critical ? e3.success || "failure" !== e3.critical || (r3 = `*${e3.roll}*`) : r3 = `**${e3.roll}**` : r3 = `~~${e3.roll}~~`, e3.matched && (r3 = `__${r3}__`), r3;
          }
          renderFateRoll(e3) {
            const r3 = 0 === e3.roll ? "0" : e3.roll > 0 ? "+" : "-";
            let t = `${e3.roll}`;
            return e3.valid ? e3.success && 1 === e3.value ? t = `**${r3}**` : e3.success && -1 === e3.value && (t = `*${r3}*`) : t = `~~${r3}~~`, e3.matched && (t = `__${t}__`), t;
          }
        };
      }, 607: function(e2, r2, t) {
        var l = this && this.__createBinding || (Object.create ? function(e3, r3, t2, l2) {
          void 0 === l2 && (l2 = t2);
          var o2 = Object.getOwnPropertyDescriptor(r3, t2);
          o2 && !("get" in o2 ? !r3.__esModule : o2.writable || o2.configurable) || (o2 = { enumerable: true, get: function() {
            return r3[t2];
          } }), Object.defineProperty(e3, l2, o2);
        } : function(e3, r3, t2, l2) {
          void 0 === l2 && (l2 = t2), e3[l2] = r3[t2];
        }), o = this && this.__exportStar || function(e3, r3) {
          for (var t2 in e3) "default" === t2 || Object.prototype.hasOwnProperty.call(r3, t2) || l(r3, e3, t2);
        };
        Object.defineProperty(r2, "__esModule", { value: true }), o(t(95), r2), o(t(604), r2), o(t(234), r2), o(t(619), r2), o(t(54), r2);
      }, 604: (e2, r2) => {
        Object.defineProperty(r2, "__esModule", { value: true });
      }, 234: (e2, r2) => {
        Object.defineProperty(r2, "__esModule", { value: true });
      }, 54: (e2, r2) => {
        Object.defineProperty(r2, "__esModule", { value: true });
      }, 51: (e2) => {
        function r2(e3, t, l, o) {
          this.message = e3, this.expected = t, this.found = l, this.location = o, this.name = "SyntaxError", "function" == typeof Error.captureStackTrace && Error.captureStackTrace(this, r2);
        }
        !function(e3, r3) {
          function t() {
            this.constructor = e3;
          }
          t.prototype = r3.prototype, e3.prototype = new t();
        }(r2, Error), r2.buildMessage = function(e3, r3) {
          var t = { literal: function(e4) {
            return '"' + o(e4.text) + '"';
          }, class: function(e4) {
            var r4, t2 = "";
            for (r4 = 0; r4 < e4.parts.length; r4++) t2 += e4.parts[r4] instanceof Array ? s(e4.parts[r4][0]) + "-" + s(e4.parts[r4][1]) : s(e4.parts[r4]);
            return "[" + (e4.inverted ? "^" : "") + t2 + "]";
          }, any: function(e4) {
            return "any character";
          }, end: function(e4) {
            return "end of input";
          }, other: function(e4) {
            return e4.description;
          } };
          function l(e4) {
            return e4.charCodeAt(0).toString(16).toUpperCase();
          }
          function o(e4) {
            return e4.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(e5) {
              return "\\x0" + l(e5);
            }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(e5) {
              return "\\x" + l(e5);
            });
          }
          function s(e4) {
            return e4.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(e5) {
              return "\\x0" + l(e5);
            }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(e5) {
              return "\\x" + l(e5);
            });
          }
          return "Expected " + function(e4) {
            var r4, l2, o2, s2 = new Array(e4.length);
            for (r4 = 0; r4 < e4.length; r4++) s2[r4] = (o2 = e4[r4], t[o2.type](o2));
            if (s2.sort(), s2.length > 0) {
              for (r4 = 1, l2 = 1; r4 < s2.length; r4++) s2[r4 - 1] !== s2[r4] && (s2[l2] = s2[r4], l2++);
              s2.length = l2;
            }
            switch (s2.length) {
              case 1:
                return s2[0];
              case 2:
                return s2[0] + " or " + s2[1];
              default:
                return s2.slice(0, -1).join(", ") + ", or " + s2[s2.length - 1];
            }
          }(e3) + " but " + function(e4) {
            return e4 ? '"' + o(e4) + '"' : "end of input";
          }(r3) + " found.";
        }, e2.exports = { SyntaxError: r2, parse: function(e3, t) {
          t = void 0 !== t ? t : {};
          var l, o = {}, s = { start: Me }, n = Me, u = { type: "any" }, a = ye("[[", false), c = ye("]]", false), i = function(e4, r3) {
            return r3 && (e4.label = r3), e4;
          }, d = ">", h = ye(">", false), p = "<", f = ye("<", false), v = "=", g = ye("=", false), y = ye("f", false), m = ye("cs", false), b = ye("cf", false), x = ye("m", false), A = ye("t", false), C = ye("k", false), M = ye("l", false), R = ye("h", false), w = ye("d", false), T = ye("{", false), $ = ye(",", false), E = ye("}", false), F = "+", k = ye("+", false), _ = ye("s", false), j = ye("a", false), O = ye("!", false), D = ye("!!", false), S = ye("!p", false), P = ye("r", false), G = ye("ro", false), I = ye("F", false), B = ye("%", false), W = ye("(", false), K = ye(")", false), U = ye("-", false), z = function(e4, r3) {
            return 0 == r3.length ? e4 : { head: e4, type: "expression", ops: r3.map((e5) => ({ type: "math", op: e5[1], tail: e5[3] })) };
          }, V = ye("*", false), q = ye("/", false), H = "**", J = ye("**", false), L = "floor", N = ye("floor", false), Q = "ceil", X = ye("ceil", false), Y = "round", Z = ye("round", false), ee = ye("abs", false), re = be("integer"), te = /^[0-9]/, le = me([["0", "9"]], false, false), oe = ye("[", false), se = /^[^\]]/, ne = me(["]"], true, false), ue = ye("]", false), ae = be("whitespace"), ce = /^[ \t\n\r]/, ie = me([" ", "	", "\n", "\r"], false, false), de = 0, he = 0, pe = [{ line: 1, column: 1 }], fe = 0, ve = [], ge = 0;
          if ("startRule" in t) {
            if (!(t.startRule in s)) throw new Error(`Can't start parsing from rule "` + t.startRule + '".');
            n = s[t.startRule];
          }
          function ye(e4, r3) {
            return { type: "literal", text: e4, ignoreCase: r3 };
          }
          function me(e4, r3, t2) {
            return { type: "class", parts: e4, inverted: r3, ignoreCase: t2 };
          }
          function be(e4) {
            return { type: "other", description: e4 };
          }
          function xe(r3) {
            var t2, l2 = pe[r3];
            if (l2) return l2;
            for (t2 = r3 - 1; !pe[t2]; ) t2--;
            for (l2 = { line: (l2 = pe[t2]).line, column: l2.column }; t2 < r3; ) 10 === e3.charCodeAt(t2) ? (l2.line++, l2.column = 1) : l2.column++, t2++;
            return pe[r3] = l2, l2;
          }
          function Ae(e4, r3) {
            var t2 = xe(e4), l2 = xe(r3);
            return { start: { offset: e4, line: t2.line, column: t2.column }, end: { offset: r3, line: l2.line, column: l2.column } };
          }
          function Ce(e4) {
            de < fe || (de > fe && (fe = de, ve = []), ve.push(e4));
          }
          function Me() {
            var r3, t2, l2, s2, n2, a2;
            if (r3 = de, (t2 = We()) !== o) {
              for (l2 = [], e3.length > de ? (s2 = e3.charAt(de), de++) : (s2 = o, 0 === ge && Ce(u)); s2 !== o; ) l2.push(s2), e3.length > de ? (s2 = e3.charAt(de), de++) : (s2 = o, 0 === ge && Ce(u));
              l2 !== o ? (he = r3, a2 = l2, (n2 = t2).root = true, a2 && (n2.label = a2.join("")), r3 = t2 = n2) : (de = r3, r3 = o);
            } else de = r3, r3 = o;
            return r3;
          }
          function Re() {
            var r3, t2, l2;
            return r3 = de, 62 === e3.charCodeAt(de) ? (t2 = d, de++) : (t2 = o, 0 === ge && Ce(h)), t2 === o && (60 === e3.charCodeAt(de) ? (t2 = p, de++) : (t2 = o, 0 === ge && Ce(f)), t2 === o && (61 === e3.charCodeAt(de) ? (t2 = v, de++) : (t2 = o, 0 === ge && Ce(g)))), t2 !== o && (l2 = Be()) !== o ? (he = r3, r3 = t2 = { type: "success", mod: t2, expr: l2 }) : (de = r3, r3 = o), r3;
          }
          function we() {
            var r3, t2, l2, s2;
            return r3 = de, 102 === e3.charCodeAt(de) ? (t2 = "f", de++) : (t2 = o, 0 === ge && Ce(y)), t2 !== o ? (62 === e3.charCodeAt(de) ? (l2 = d, de++) : (l2 = o, 0 === ge && Ce(h)), l2 === o && (60 === e3.charCodeAt(de) ? (l2 = p, de++) : (l2 = o, 0 === ge && Ce(f)), l2 === o && (61 === e3.charCodeAt(de) ? (l2 = v, de++) : (l2 = o, 0 === ge && Ce(g)))), l2 === o && (l2 = null), l2 !== o && (s2 = Be()) !== o ? (he = r3, r3 = t2 = { type: "failure", mod: l2, expr: s2 }) : (de = r3, r3 = o)) : (de = r3, r3 = o), r3;
          }
          function Te() {
            var r3, t2, l2, s2;
            return r3 = de, "cs" === e3.substr(de, 2) ? (t2 = "cs", de += 2) : (t2 = o, 0 === ge && Ce(m)), t2 !== o ? (62 === e3.charCodeAt(de) ? (l2 = d, de++) : (l2 = o, 0 === ge && Ce(h)), l2 === o && (60 === e3.charCodeAt(de) ? (l2 = p, de++) : (l2 = o, 0 === ge && Ce(f)), l2 === o && (61 === e3.charCodeAt(de) ? (l2 = v, de++) : (l2 = o, 0 === ge && Ce(g)))), l2 === o && (l2 = null), l2 !== o && (s2 = Be()) !== o ? (he = r3, r3 = t2 = { type: "crit", mod: l2, expr: s2 }) : (de = r3, r3 = o)) : (de = r3, r3 = o), r3;
          }
          function $e() {
            var r3, t2, l2, s2;
            return r3 = de, "cf" === e3.substr(de, 2) ? (t2 = "cf", de += 2) : (t2 = o, 0 === ge && Ce(b)), t2 !== o ? (62 === e3.charCodeAt(de) ? (l2 = d, de++) : (l2 = o, 0 === ge && Ce(h)), l2 === o && (60 === e3.charCodeAt(de) ? (l2 = p, de++) : (l2 = o, 0 === ge && Ce(f)), l2 === o && (61 === e3.charCodeAt(de) ? (l2 = v, de++) : (l2 = o, 0 === ge && Ce(g)))), l2 === o && (l2 = null), l2 !== o && (s2 = Be()) !== o ? (he = r3, r3 = t2 = { type: "critfail", mod: l2, expr: s2 }) : (de = r3, r3 = o)) : (de = r3, r3 = o), r3;
          }
          function Ee() {
            var r3, t2, l2, s2;
            return r3 = de, 107 === e3.charCodeAt(de) ? (t2 = "k", de++) : (t2 = o, 0 === ge && Ce(C)), t2 !== o ? (108 === e3.charCodeAt(de) ? (l2 = "l", de++) : (l2 = o, 0 === ge && Ce(M)), l2 === o && (104 === e3.charCodeAt(de) ? (l2 = "h", de++) : (l2 = o, 0 === ge && Ce(R))), l2 === o && (l2 = null), l2 !== o ? ((s2 = Be()) === o && (s2 = null), s2 !== o ? (he = r3, r3 = t2 = { type: "keep", highlow: l2, expr: s2 || Qe }) : (de = r3, r3 = o)) : (de = r3, r3 = o)) : (de = r3, r3 = o), r3;
          }
          function Fe() {
            var r3, t2, l2, s2;
            return r3 = de, 100 === e3.charCodeAt(de) ? (t2 = "d", de++) : (t2 = o, 0 === ge && Ce(w)), t2 !== o ? (108 === e3.charCodeAt(de) ? (l2 = "l", de++) : (l2 = o, 0 === ge && Ce(M)), l2 === o && (104 === e3.charCodeAt(de) ? (l2 = "h", de++) : (l2 = o, 0 === ge && Ce(R))), l2 === o && (l2 = null), l2 !== o ? ((s2 = Be()) === o && (s2 = null), s2 !== o ? (he = r3, r3 = t2 = { type: "drop", highlow: l2, expr: s2 || Qe }) : (de = r3, r3 = o)) : (de = r3, r3 = o)) : (de = r3, r3 = o), r3;
          }
          function ke() {
            var r3, t2, l2, s2, n2, u2, a2, c2, i2, d2;
            if (r3 = de, (t2 = _e()) !== o) {
              for (l2 = [], s2 = de, (n2 = Le()) !== o ? (43 === e3.charCodeAt(de) ? (u2 = F, de++) : (u2 = o, 0 === ge && Ce(k)), u2 !== o && (a2 = Le()) !== o && (c2 = _e()) !== o ? s2 = n2 = [n2, u2, a2, c2] : (de = s2, s2 = o)) : (de = s2, s2 = o); s2 !== o; ) l2.push(s2), s2 = de, (n2 = Le()) !== o ? (43 === e3.charCodeAt(de) ? (u2 = F, de++) : (u2 = o, 0 === ge && Ce(k)), u2 !== o && (a2 = Le()) !== o && (c2 = _e()) !== o ? s2 = n2 = [n2, u2, a2, c2] : (de = s2, s2 = o)) : (de = s2, s2 = o);
              l2 !== o ? (he = r3, i2 = t2, r3 = t2 = 0 == (d2 = l2).length ? i2 : { head: i2, type: "diceExpression", ops: d2.map((e4) => ({ type: "math", op: e4[1], tail: e4[3] })) }) : (de = r3, r3 = o);
            } else de = r3, r3 = o;
            return r3;
          }
          function _e() {
            var e4;
            return (e4 = je()) === o && (e4 = We()), e4;
          }
          function je() {
            var r3, t2, l2;
            return r3 = de, t2 = function() {
              var r4, t3, l3, s2, n2;
              if (r4 = de, t3 = function() {
                var r5, t4, l4, s3, n3, u2;
                if (r5 = de, t4 = function() {
                  var r6, t5, l5, s4;
                  return r6 = de, (t5 = Be()) === o && (t5 = null), t5 !== o ? (100 === e3.charCodeAt(de) ? (l5 = "d", de++) : (l5 = o, 0 === ge && Ce(w)), l5 !== o ? (s4 = function() {
                    var r7, t6;
                    return r7 = de, 70 === e3.charCodeAt(de) ? (t6 = "F", de++) : (t6 = o, 0 === ge && Ce(I)), t6 === o && (102 === e3.charCodeAt(de) ? (t6 = "f", de++) : (t6 = o, 0 === ge && Ce(y))), t6 !== o && (he = r7, t6 = { type: "fate" }), t6;
                  }(), s4 === o && (s4 = function() {
                    var r7, t6;
                    return r7 = de, 37 === e3.charCodeAt(de) ? (t6 = "%", de++) : (t6 = o, 0 === ge && Ce(B)), t6 !== o && (he = r7, t6 = { type: "number", value: "100" }), t6;
                  }(), s4 === o && (s4 = Be())), s4 !== o ? (he = r6, r6 = t5 = { die: s4, count: t5 || { type: "number", value: 1 }, type: "die" }) : (de = r6, r6 = o)) : (de = r6, r6 = o)) : (de = r6, r6 = o), r6;
                }(), t4 !== o) {
                  for (l4 = [], (s3 = De()) === o && (s3 = Se()) === o && (s3 = Oe()) === o && (s3 = Ge()) === o && (s3 = Pe()); s3 !== o; ) l4.push(s3), (s3 = De()) === o && (s3 = Se()) === o && (s3 = Oe()) === o && (s3 = Ge()) === o && (s3 = Pe());
                  l4 !== o ? (he = r5, u2 = l4, (n3 = t4).mods = (n3.mods || []).concat(u2), r5 = t4 = n3) : (de = r5, r5 = o);
                } else de = r5, r5 = o;
                return r5;
              }(), t3 !== o) {
                for (l3 = [], (s2 = Fe()) === o && (s2 = Ee()) === o && (s2 = Re()) === o && (s2 = we()) === o && (s2 = $e()) === o && (s2 = Te()); s2 !== o; ) l3.push(s2), (s2 = Fe()) === o && (s2 = Ee()) === o && (s2 = Re()) === o && (s2 = we()) === o && (s2 = $e()) === o && (s2 = Te());
                l3 !== o ? ((s2 = function() {
                  var r5, t4, l4, s3, n3;
                  return r5 = de, 109 === e3.charCodeAt(de) ? (t4 = "m", de++) : (t4 = o, 0 === ge && Ce(x)), t4 !== o ? (116 === e3.charCodeAt(de) ? (l4 = "t", de++) : (l4 = o, 0 === ge && Ce(A)), l4 === o && (l4 = null), l4 !== o ? ((s3 = He()) === o && (s3 = null), s3 !== o ? (n3 = function() {
                    var r6, t5, l5;
                    return r6 = de, 62 === e3.charCodeAt(de) ? (t5 = d, de++) : (t5 = o, 0 === ge && Ce(h)), t5 === o && (60 === e3.charCodeAt(de) ? (t5 = p, de++) : (t5 = o, 0 === ge && Ce(f)), t5 === o && (61 === e3.charCodeAt(de) ? (t5 = v, de++) : (t5 = o, 0 === ge && Ce(g)))), t5 !== o && (l5 = Be()) !== o ? (he = r6, r6 = t5 = { mod: t5, expr: l5 }) : (de = r6, r6 = o), r6;
                  }(), n3 === o && (n3 = null), n3 !== o ? (he = r5, r5 = t4 = function(e4, r6, t5) {
                    const l5 = { type: "match", min: r6 || { type: "number", value: 2 }, count: !!e4 };
                    return t5 && (l5.mod = t5.mod, l5.expr = t5.expr), l5;
                  }(l4, s3, n3)) : (de = r5, r5 = o)) : (de = r5, r5 = o)) : (de = r5, r5 = o)) : (de = r5, r5 = o), r5;
                }()) === o && (s2 = null), s2 !== o ? (n2 = function() {
                  var r5, t4, l4;
                  return r5 = de, 115 === e3.charCodeAt(de) ? (t4 = "s", de++) : (t4 = o, 0 === ge && Ce(_)), t4 !== o ? (97 === e3.charCodeAt(de) ? (l4 = "a", de++) : (l4 = o, 0 === ge && Ce(j)), l4 === o && (100 === e3.charCodeAt(de) ? (l4 = "d", de++) : (l4 = o, 0 === ge && Ce(w))), l4 === o && (l4 = null), l4 !== o ? (he = r5, r5 = t4 = "d" == l4 ? { type: "sort", asc: false } : { type: "sort", asc: true }) : (de = r5, r5 = o)) : (de = r5, r5 = o), r5;
                }(), n2 === o && (n2 = null), n2 !== o ? (he = r4, r4 = t3 = function(e4, r5, t4, l4) {
                  const o2 = r5.filter((e5) => ["success", "failure"].includes(e5.type));
                  return r5 = r5.filter((e5) => !o2.includes(e5)), e4.mods = (e4.mods || []).concat(r5), o2.length > 0 && (e4.targets = o2), t4 && (e4.match = t4), l4 && (e4.sort = l4), e4;
                }(t3, l3, s2, n2)) : (de = r4, r4 = o)) : (de = r4, r4 = o)) : (de = r4, r4 = o);
              } else de = r4, r4 = o;
              return r4;
            }(), t2 !== o && Le() !== o ? ((l2 = Je()) === o && (l2 = null), l2 !== o ? (he = r3, r3 = t2 = i(t2, l2)) : (de = r3, r3 = o)) : (de = r3, r3 = o), r3;
          }
          function Oe() {
            var r3, t2, l2;
            return r3 = de, 33 === e3.charCodeAt(de) ? (t2 = "!", de++) : (t2 = o, 0 === ge && Ce(O)), t2 !== o ? ((l2 = Ie()) === o && (l2 = null), l2 !== o ? (he = r3, r3 = t2 = { type: "explode", target: l2 }) : (de = r3, r3 = o)) : (de = r3, r3 = o), r3;
          }
          function De() {
            var r3, t2, l2;
            return r3 = de, "!!" === e3.substr(de, 2) ? (t2 = "!!", de += 2) : (t2 = o, 0 === ge && Ce(D)), t2 !== o ? ((l2 = Ie()) === o && (l2 = null), l2 !== o ? (he = r3, r3 = t2 = { type: "compound", target: l2 }) : (de = r3, r3 = o)) : (de = r3, r3 = o), r3;
          }
          function Se() {
            var r3, t2, l2;
            return r3 = de, "!p" === e3.substr(de, 2) ? (t2 = "!p", de += 2) : (t2 = o, 0 === ge && Ce(S)), t2 !== o ? ((l2 = Ie()) === o && (l2 = null), l2 !== o ? (he = r3, r3 = t2 = { type: "penetrate", target: l2 }) : (de = r3, r3 = o)) : (de = r3, r3 = o), r3;
          }
          function Pe() {
            var r3, t2, l2;
            return r3 = de, 114 === e3.charCodeAt(de) ? (t2 = "r", de++) : (t2 = o, 0 === ge && Ce(P)), t2 !== o ? ((l2 = Ie()) === o && (l2 = null), l2 !== o ? (he = r3, r3 = t2 = { type: "reroll", target: l2 || Ne }) : (de = r3, r3 = o)) : (de = r3, r3 = o), r3;
          }
          function Ge() {
            var r3, t2, l2;
            return r3 = de, "ro" === e3.substr(de, 2) ? (t2 = "ro", de += 2) : (t2 = o, 0 === ge && Ce(G)), t2 !== o ? ((l2 = Ie()) === o && (l2 = null), l2 !== o ? (he = r3, r3 = t2 = { type: "rerollOnce", target: l2 || Ne }) : (de = r3, r3 = o)) : (de = r3, r3 = o), r3;
          }
          function Ie() {
            var r3, t2, l2;
            return r3 = de, 62 === e3.charCodeAt(de) ? (t2 = d, de++) : (t2 = o, 0 === ge && Ce(h)), t2 === o && (60 === e3.charCodeAt(de) ? (t2 = p, de++) : (t2 = o, 0 === ge && Ce(f)), t2 === o && (61 === e3.charCodeAt(de) ? (t2 = v, de++) : (t2 = o, 0 === ge && Ce(g)))), t2 === o && (t2 = null), t2 !== o && (l2 = Be()) !== o ? (he = r3, r3 = t2 = { type: "target", mod: t2, value: l2 }) : (de = r3, r3 = o), r3;
          }
          function Be() {
            var e4;
            return (e4 = Ke()) === o && (e4 = He()), e4;
          }
          function We() {
            var r3;
            return (r3 = function() {
              var r4, t2, l2, s2;
              return r4 = de, "[[" === e3.substr(de, 2) ? (t2 = "[[", de += 2) : (t2 = o, 0 === ge && Ce(a)), t2 !== o && (l2 = We()) !== o ? ("]]" === e3.substr(de, 2) ? (s2 = "]]", de += 2) : (s2 = o, 0 === ge && Ce(c)), s2 !== o ? (he = r4, r4 = t2 = { type: "inline", expr: l2 }) : (de = r4, r4 = o)) : (de = r4, r4 = o), r4;
            }()) === o && (r3 = Ue()) === o && (r3 = Ke()), r3;
          }
          function Ke() {
            var r3, t2, l2, s2, n2, u2, a2;
            return r3 = de, 40 === e3.charCodeAt(de) ? (t2 = "(", de++) : (t2 = o, 0 === ge && Ce(W)), t2 !== o && (l2 = Ue()) !== o ? (41 === e3.charCodeAt(de) ? (s2 = ")", de++) : (s2 = o, 0 === ge && Ce(K)), s2 !== o && Le() !== o ? ((n2 = Je()) === o && (n2 = null), n2 !== o ? (he = r3, u2 = l2, (a2 = n2) && (u2.label = a2), r3 = t2 = u2) : (de = r3, r3 = o)) : (de = r3, r3 = o)) : (de = r3, r3 = o), r3;
          }
          function Ue() {
            var r3, t2, l2, s2, n2, u2, a2, c2;
            if (r3 = de, (t2 = ze()) !== o) {
              for (l2 = [], s2 = de, (n2 = Le()) !== o ? (43 === e3.charCodeAt(de) ? (u2 = F, de++) : (u2 = o, 0 === ge && Ce(k)), u2 === o && (45 === e3.charCodeAt(de) ? (u2 = "-", de++) : (u2 = o, 0 === ge && Ce(U))), u2 !== o && (a2 = Le()) !== o && (c2 = ze()) !== o ? s2 = n2 = [n2, u2, a2, c2] : (de = s2, s2 = o)) : (de = s2, s2 = o); s2 !== o; ) l2.push(s2), s2 = de, (n2 = Le()) !== o ? (43 === e3.charCodeAt(de) ? (u2 = F, de++) : (u2 = o, 0 === ge && Ce(k)), u2 === o && (45 === e3.charCodeAt(de) ? (u2 = "-", de++) : (u2 = o, 0 === ge && Ce(U))), u2 !== o && (a2 = Le()) !== o && (c2 = ze()) !== o ? s2 = n2 = [n2, u2, a2, c2] : (de = s2, s2 = o)) : (de = s2, s2 = o);
              l2 !== o ? (he = r3, r3 = t2 = z(t2, l2)) : (de = r3, r3 = o);
            } else de = r3, r3 = o;
            return r3;
          }
          function ze() {
            var r3, t2, l2, s2, n2, u2, a2, c2;
            if (r3 = de, (t2 = Ve()) !== o) {
              for (l2 = [], s2 = de, (n2 = Le()) !== o ? (42 === e3.charCodeAt(de) ? (u2 = "*", de++) : (u2 = o, 0 === ge && Ce(V)), u2 === o && (47 === e3.charCodeAt(de) ? (u2 = "/", de++) : (u2 = o, 0 === ge && Ce(q))), u2 !== o && (a2 = Le()) !== o && (c2 = Ve()) !== o ? s2 = n2 = [n2, u2, a2, c2] : (de = s2, s2 = o)) : (de = s2, s2 = o); s2 !== o; ) l2.push(s2), s2 = de, (n2 = Le()) !== o ? (42 === e3.charCodeAt(de) ? (u2 = "*", de++) : (u2 = o, 0 === ge && Ce(V)), u2 === o && (47 === e3.charCodeAt(de) ? (u2 = "/", de++) : (u2 = o, 0 === ge && Ce(q))), u2 !== o && (a2 = Le()) !== o && (c2 = Ve()) !== o ? s2 = n2 = [n2, u2, a2, c2] : (de = s2, s2 = o)) : (de = s2, s2 = o);
              l2 !== o ? (he = r3, r3 = t2 = z(t2, l2)) : (de = r3, r3 = o);
            } else de = r3, r3 = o;
            return r3;
          }
          function Ve() {
            var r3, t2, l2, s2, n2, u2, a2, c2;
            if (r3 = de, (t2 = qe()) !== o) {
              for (l2 = [], s2 = de, (n2 = Le()) !== o ? (e3.substr(de, 2) === H ? (u2 = H, de += 2) : (u2 = o, 0 === ge && Ce(J)), u2 === o && (37 === e3.charCodeAt(de) ? (u2 = "%", de++) : (u2 = o, 0 === ge && Ce(B))), u2 !== o && (a2 = Le()) !== o && (c2 = qe()) !== o ? s2 = n2 = [n2, u2, a2, c2] : (de = s2, s2 = o)) : (de = s2, s2 = o); s2 !== o; ) l2.push(s2), s2 = de, (n2 = Le()) !== o ? (e3.substr(de, 2) === H ? (u2 = H, de += 2) : (u2 = o, 0 === ge && Ce(J)), u2 === o && (37 === e3.charCodeAt(de) ? (u2 = "%", de++) : (u2 = o, 0 === ge && Ce(B))), u2 !== o && (a2 = Le()) !== o && (c2 = qe()) !== o ? s2 = n2 = [n2, u2, a2, c2] : (de = s2, s2 = o)) : (de = s2, s2 = o);
              l2 !== o ? (he = r3, r3 = t2 = z(t2, l2)) : (de = r3, r3 = o);
            } else de = r3, r3 = o;
            return r3;
          }
          function qe() {
            var r3;
            return (r3 = function() {
              var r4, t2, l2, s2, n2;
              return r4 = de, t2 = function() {
                var r5;
                return e3.substr(de, 5) === L ? (r5 = L, de += 5) : (r5 = o, 0 === ge && Ce(N)), r5 === o && (e3.substr(de, 4) === Q ? (r5 = Q, de += 4) : (r5 = o, 0 === ge && Ce(X)), r5 === o && (e3.substr(de, 5) === Y ? (r5 = Y, de += 5) : (r5 = o, 0 === ge && Ce(Z)), r5 === o && ("abs" === e3.substr(de, 3) ? (r5 = "abs", de += 3) : (r5 = o, 0 === ge && Ce(ee))))), r5;
              }(), t2 !== o && Le() !== o ? (40 === e3.charCodeAt(de) ? (l2 = "(", de++) : (l2 = o, 0 === ge && Ce(W)), l2 !== o && Le() !== o && (s2 = Ue()) !== o && Le() !== o ? (41 === e3.charCodeAt(de) ? (n2 = ")", de++) : (n2 = o, 0 === ge && Ce(K)), n2 !== o ? (he = r4, r4 = t2 = { type: "mathfunction", op: t2, expr: s2 }) : (de = r4, r4 = o)) : (de = r4, r4 = o)) : (de = r4, r4 = o), r4;
            }()) === o && (r3 = function() {
              var r4, t2, l2;
              return r4 = de, t2 = function() {
                var r5, t3, l3, s2, n2, u2, a2, c2;
                if (r5 = de, t3 = function() {
                  var r6, t4, l4, s3, n3, u3, a3, c3, i2;
                  if (r6 = de, 123 === e3.charCodeAt(de) ? (t4 = "{", de++) : (t4 = o, 0 === ge && Ce(T)), t4 !== o) if (Le() !== o) if ((l4 = ke()) !== o) {
                    for (s3 = [], n3 = de, (u3 = Le()) !== o ? (44 === e3.charCodeAt(de) ? (a3 = ",", de++) : (a3 = o, 0 === ge && Ce($)), a3 !== o && (c3 = Le()) !== o && (i2 = ke()) !== o ? n3 = u3 = [u3, a3, c3, i2] : (de = n3, n3 = o)) : (de = n3, n3 = o); n3 !== o; ) s3.push(n3), n3 = de, (u3 = Le()) !== o ? (44 === e3.charCodeAt(de) ? (a3 = ",", de++) : (a3 = o, 0 === ge && Ce($)), a3 !== o && (c3 = Le()) !== o && (i2 = ke()) !== o ? n3 = u3 = [u3, a3, c3, i2] : (de = n3, n3 = o)) : (de = n3, n3 = o);
                    s3 !== o && (n3 = Le()) !== o ? (125 === e3.charCodeAt(de) ? (u3 = "}", de++) : (u3 = o, 0 === ge && Ce(E)), u3 !== o ? (he = r6, r6 = t4 = { rolls: [l4, ...s3.map((e4) => e4[3])], type: "group" }) : (de = r6, r6 = o)) : (de = r6, r6 = o);
                  } else de = r6, r6 = o;
                  else de = r6, r6 = o;
                  else de = r6, r6 = o;
                  return r6;
                }(), t3 !== o) {
                  for (l3 = [], (s2 = Ee()) === o && (s2 = Fe()) === o && (s2 = Re()) === o && (s2 = we()); s2 !== o; ) l3.push(s2), (s2 = Ee()) === o && (s2 = Fe()) === o && (s2 = Re()) === o && (s2 = we());
                  l3 !== o && (s2 = Le()) !== o ? ((n2 = Je()) === o && (n2 = null), n2 !== o ? (he = r5, u2 = t3, c2 = n2, (a2 = l3).length > 0 && (u2.mods = (u2.mods || []).concat(a2)), c2 && (u2.label = c2), r5 = t3 = u2) : (de = r5, r5 = o)) : (de = r5, r5 = o);
                } else de = r5, r5 = o;
                return r5;
              }(), t2 === o && (t2 = je()) === o && (t2 = He()), t2 !== o && Le() !== o ? ((l2 = Je()) === o && (l2 = null), l2 !== o ? (he = r4, r4 = t2 = i(t2, l2)) : (de = r4, r4 = o)) : (de = r4, r4 = o), r4;
            }()) === o && (r3 = Ke()), r3;
          }
          function He() {
            var r3, t2, l2, s2;
            if (ge++, r3 = de, 45 === e3.charCodeAt(de) ? (t2 = "-", de++) : (t2 = o, 0 === ge && Ce(U)), t2 === o && (t2 = null), t2 !== o) {
              if (l2 = [], te.test(e3.charAt(de)) ? (s2 = e3.charAt(de), de++) : (s2 = o, 0 === ge && Ce(le)), s2 !== o) for (; s2 !== o; ) l2.push(s2), te.test(e3.charAt(de)) ? (s2 = e3.charAt(de), de++) : (s2 = o, 0 === ge && Ce(le));
              else l2 = o;
              l2 !== o ? (he = r3, r3 = t2 = { type: "number", value: parseInt(e3.substring(he, de), 10) }) : (de = r3, r3 = o);
            } else de = r3, r3 = o;
            return ge--, r3 === o && (t2 = o, 0 === ge && Ce(re)), r3;
          }
          function Je() {
            var r3, t2, l2, s2;
            if (r3 = de, 91 === e3.charCodeAt(de) ? (t2 = "[", de++) : (t2 = o, 0 === ge && Ce(oe)), t2 !== o) {
              if (l2 = [], se.test(e3.charAt(de)) ? (s2 = e3.charAt(de), de++) : (s2 = o, 0 === ge && Ce(ne)), s2 !== o) for (; s2 !== o; ) l2.push(s2), se.test(e3.charAt(de)) ? (s2 = e3.charAt(de), de++) : (s2 = o, 0 === ge && Ce(ne));
              else l2 = o;
              l2 !== o ? (93 === e3.charCodeAt(de) ? (s2 = "]", de++) : (s2 = o, 0 === ge && Ce(ue)), s2 !== o ? (he = r3, r3 = t2 = l2.join("")) : (de = r3, r3 = o)) : (de = r3, r3 = o);
            } else de = r3, r3 = o;
            return r3;
          }
          function Le() {
            var r3, t2;
            for (ge++, r3 = [], ce.test(e3.charAt(de)) ? (t2 = e3.charAt(de), de++) : (t2 = o, 0 === ge && Ce(ie)); t2 !== o; ) r3.push(t2), ce.test(e3.charAt(de)) ? (t2 = e3.charAt(de), de++) : (t2 = o, 0 === ge && Ce(ie));
            return ge--, r3 === o && (t2 = o, 0 === ge && Ce(ae)), r3;
          }
          const Ne = { type: "target", mod: "=", value: { type: "number", value: 1 } }, Qe = { type: "number", value: 1 };
          if ((l = n()) !== o && de === e3.length) return l;
          throw l !== o && de < e3.length && Ce({ type: "end" }), Xe = ve, Ye = fe < e3.length ? e3.charAt(fe) : null, Ze = fe < e3.length ? Ae(fe, fe + 1) : Ae(fe, fe), new r2(r2.buildMessage(Xe, Ye), Xe, Ye, Ze);
          var Xe, Ye, Ze;
        } };
      } }, r = {};
      return function t(l) {
        var o = r[l];
        if (void 0 !== o) return o.exports;
        var s = r[l] = { exports: {} };
        return e[l].call(s.exports, s, s.exports, t), s.exports;
      }(607);
    })());
  }
});

// node_modules/@3d-dice/dice-ui/src/displayResults/displayResults.js
import "C:/Users/japie/Downloads/dice-box-1.1.14/dice-box-1.1.14/demo/react-project/node_modules/@3d-dice/dice-ui/src/displayResults/displayResults.css";
import cancelIcon from "C:/Users/japie/Downloads/dice-box-1.1.14/dice-box-1.1.14/demo/react-project/node_modules/@3d-dice/dice-ui/src/displayResults/icons/cancel.svg";
import checkIcon from "C:/Users/japie/Downloads/dice-box-1.1.14/dice-box-1.1.14/demo/react-project/node_modules/@3d-dice/dice-ui/src/displayResults/icons/checkmark.svg";
import minusIcon from "C:/Users/japie/Downloads/dice-box-1.1.14/dice-box-1.1.14/demo/react-project/node_modules/@3d-dice/dice-ui/src/displayResults/icons/minus.svg";
var DisplayResults = class {
  constructor(selector) {
    this.target = document.querySelector(selector) || document.body;
    this.timeout = 500;
    this.elem = document.createElement("div");
    this.elem.className = "displayResults";
    this.resultsElem1 = document.createElement("div");
    this.resultsElem1.className = "results hidden";
    this.resultsElem1.style.transition = `all ${this.timeout}ms`;
    this.resultsElem2 = document.createElement("div");
    this.resultsElem2.className = "results hidden";
    this.resultsElem2.style.transition = `all ${this.timeout}ms`;
    this.init();
  }
  async init() {
    this.elem.append(this.resultsElem1);
    this.elem.append(this.resultsElem2);
    this.target.prepend(this.elem);
    this.resultsElem1.addEventListener("click", () => this.clear());
    this.resultsElem2.addEventListener("click", () => this.clear());
    this.even = false;
  }
  showResults(data) {
    this.clear(this[`resultsElem${this.even ? 1 : 2}`]);
    let rolls;
    if (data.rolls && !Array.isArray(data.rolls)) {
      rolls = Object.values(data.rolls).map((roll) => roll);
    } else {
      rolls = Object.values(this.recursiveSearch(data, "rolls")).map((group) => {
        return Object.values(group);
      }).flat();
    }
    let total = 0;
    if (data.hasOwnProperty("value")) {
      total = data.value;
    } else {
      total = rolls.reduce((val, roll) => val + roll.value, 0);
      let modifier = data.reduce((val, roll) => val + roll.modifier, 0);
      total += modifier;
    }
    total = isNaN(total) ? "..." : total;
    if (typeof total === "string") {
      let logValue = function(value) {
        if (value && typeof value === "string") {
          if (counter[value]) {
            counter[value] = counter[value] + 1;
          } else {
            counter[value] = 1;
          }
        }
      };
      const counter = {};
      rolls.forEach((roll) => {
        if (typeof roll.value === "string") {
          logValue(roll.value);
        }
        if (Array.isArray(roll.value)) {
          roll.value.forEach((val) => {
            logValue(val);
          });
        }
      });
      total = "";
      const sortedCounter = Object.fromEntries(Object.entries(counter).sort());
      Object.entries(sortedCounter).forEach(([key, val], i) => {
        if (i !== 0) {
          total += ", ";
        }
        total += key + ": " + val;
      });
    }
    let resultString = "";
    rolls.forEach((roll, i) => {
      let val;
      let sides = roll.die || roll.sides || "fate";
      if (i !== 0 && resultString.length) {
        if (typeof roll.value !== "undefined" && (roll.value.length || typeof roll.value === "number")) {
          resultString += ", ";
        }
      }
      if (roll.success !== void 0 && roll.success !== null) {
        val = roll.success ? `<svg class="success"><use href="${checkIcon}#checkmark"></use></svg>` : roll.failures > 0 ? `<svg class="failure"><use href="${cancelIcon}#cancel"></use></svg>` : `<svg class="null"><use href="${minusIcon}#minus"></use></svg>`;
      } else {
        val = roll.hasOwnProperty("value") ? roll.value.toString() : "...";
        if (val.includes(",")) {
          val = val.replace(",", ", ");
        }
      }
      let classes = `d${sides}`;
      if (roll.critical === "success" || roll.hasOwnProperty("value") && sides == roll.value) {
        classes += " crit-success";
      }
      if (roll.critical === "failure" || roll.success === null && roll.hasOwnProperty("value") && roll.value <= 1 && sides !== "fate") {
        classes += " crit-failure";
      }
      if (roll.drop) {
        classes += " die-dropped";
      }
      if (roll.reroll) {
        classes += " die-rerolled";
      }
      if (roll.explode) {
        classes += " die-exploded";
      }
      if (sides === "fate") {
        if (roll.value === 1) {
          classes += " crit-success";
        }
        if (roll.value === -1) {
          classes += " crit-failure";
        }
      }
      if (val && classes !== "") {
        val = `<span class='${classes.trim()}'>${val}</span>`;
      }
      resultString += val;
    });
    resultString += ` = <strong>${total}</strong>`;
    const currentElem = this[`resultsElem${this.even ? 2 : 1}`];
    currentElem.innerHTML = resultString;
    clearTimeout(currentElem.hideTimer);
    currentElem.classList.add("showEffect");
    currentElem.classList.remove("hidden");
    currentElem.classList.remove("hideEffect");
    this.even = !this.even;
  }
  clear(elem) {
    const currentElem = elem || this[`resultsElem${this.even ? 1 : 2}`];
    currentElem.classList.replace("showEffect", "hideEffect");
    this.even = !this.even;
    currentElem.hideTimer = setTimeout(() => currentElem.classList.replace("hideEffect", "hidden"), this.timeout);
  }
  // make this static for use by other systems?
  recursiveSearch(obj, searchKey, results = [], callback) {
    const r = results;
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (key === searchKey) {
        r.push(value);
        if (callback && typeof callback === "function") {
          callback(obj);
        }
      } else if (value && typeof value === "object") {
        this.recursiveSearch(value, searchKey, r, callback);
      }
    });
    return r;
  }
};
var displayResults_default = DisplayResults;

// node_modules/@3d-dice/dice-ui/src/advancedRoller/advancedRoller.js
import "C:/Users/japie/Downloads/dice-box-1.1.14/dice-box-1.1.14/demo/react-project/node_modules/@3d-dice/dice-ui/src/advancedRoller/advancedRoller.css";

// node_modules/@3d-dice/dice-parser-interface/src/ParserInterface.js
var import_dice_roller_parser = __toESM(require_dist());
var externalCount = 0;
var ParserInterface = class {
  constructor(options = {}) {
    this.rollsAsFloats = [];
    this.dieGroups = [];
    this.parsedNotation = null;
    this.finalResults = null;
    this.targetRollsCritSuccess = (options == null ? void 0 : options.targetRollsCritSuccess) || (options == null ? void 0 : options.targetRollsCrit) || false, this.targetRollsCritFailure = (options == null ? void 0 : options.targetRollsCritFailure) || (options == null ? void 0 : options.targetRollsCrit) || false, this.initParser();
  }
  //TODO: toggle targetRollsCritSuccess and targetRollsCritFailure externally
  // Set up the parser with our custom random function
  initParser() {
    this.rollParser = new import_dice_roller_parser.DiceRoller((rolls = this.rollsAsFloats) => {
      if (rolls.length > 0) {
        return rolls[externalCount++];
      } else {
        console.warn("No result was passed to the dice-roller-parser. Using fallback Math.random");
        return Math.random();
      }
    });
  }
  parseNotation(notation) {
    this.clear();
    notation = notation.replace(/d00/, "d%");
    this.parsedNotation = this.rollParser.parse(notation);
    const findDie = (obj) => {
      const sides = obj.die.value || obj.die.type;
      this.dieGroups.push({
        qty: obj.count.value,
        sides,
        mods: obj.mods
      });
    };
    this.recursiveSearch(this.parsedNotation, "die", [], findDie);
    return this.dieGroups;
  }
  rollNotation(notationObject) {
    this.finalResults = this.rollParser.rollParsed(notationObject);
    return this.finalResults;
  }
  clear() {
    externalCount = 0;
    this.rollsAsFloats = [];
    this.dieGroups = [];
    this.parsedNotation = null;
    this.finalResults = null;
  }
  // make this static for use by other systems?
  recursiveSearch(obj, searchKey, results = [], callback) {
    const r = results;
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (key === searchKey) {
        r.push(value);
        if (callback && typeof callback === "function") {
          callback(obj);
        }
      } else if (value && typeof value === "object") {
        this.recursiveSearch(value, searchKey, r, callback);
      }
    });
    return r;
  }
  incrementId(key) {
    key = key.toString();
    let splitKey = key.split(".");
    if (splitKey[1]) {
      splitKey[1] = parseInt(splitKey[1]) + 1;
    } else {
      splitKey[1] = 1;
    }
    return splitKey[0] + "." + splitKey[1];
  }
  // TODO: this needs to return a object of rolls that need to be rolled again, 
  handleRerolls(rollResults = []) {
    const rerolls = [];
    rollResults.forEach((group, groupId) => {
      var _a;
      if (((_a = group.mods) == null ? void 0 : _a.length) > 0) {
        const successTest = (roll, mod, target) => {
          switch (mod) {
            case ">":
              return roll >= target;
            case "<":
              return roll <= target;
            case "=":
            default:
              return roll == target;
          }
        };
        const rollIds = group.rolls.map((roll) => roll.rollId);
        const alreadyReRolled = (id) => {
          const increment = this.incrementId(id);
          return rollIds.includes(increment);
        };
        group.mods.forEach((mod) => {
          const rollsCopy = { ...group.rolls };
          switch (mod.type) {
            case "explode":
            case "compound":
              Object.entries(rollsCopy).forEach(([key, die]) => {
                var _a2, _b, _c;
                const max = die.sides;
                const target = ((_b = (_a2 = mod.target) == null ? void 0 : _a2.value) == null ? void 0 : _b.value) || max;
                const op = ((_c = mod.target) == null ? void 0 : _c.mod) || ">";
                if (successTest(die.value, op, target) && !alreadyReRolled(die.rollId)) {
                  rerolls.push({
                    groupId,
                    rollId: this.incrementId(die.rollId),
                    sides: die.sides,
                    qty: 1
                  });
                }
              });
              break;
            case "penetrate":
              Object.entries(rollsCopy).forEach(([key, die]) => {
                var _a2, _b, _c;
                const max = die.sides;
                const target = ((_b = (_a2 = mod.target) == null ? void 0 : _a2.value) == null ? void 0 : _b.value) || max;
                const op = ((_c = mod.target) == null ? void 0 : _c.mod) || "=";
                if (successTest(die.value, op, target) && !alreadyReRolled(die.rollId)) {
                  rerolls.push({
                    groupId,
                    rollId: this.incrementId(die.rollId),
                    // sides: die.sides === 100 ? 20 : die.sides === 20 ? 6 : die.sides,
                    sides: die.sides,
                    qty: 1
                  });
                }
              });
              break;
            case "reroll":
              Object.entries(rollsCopy).forEach(([key, die]) => {
                const max = die.sides;
                if (successTest(die.value, mod.target.mod, mod.target.value.value) && !alreadyReRolled(die.rollId)) {
                  rerolls.push({
                    groupId,
                    rollId: this.incrementId(die.rollId),
                    sides: die.sides,
                    qty: 1
                  });
                }
              });
              break;
            case "rerollOnce":
              Object.entries(rollsCopy).forEach(([key, die]) => {
                var _a2, _b;
                const target = (_b = (_a2 = mod.target) == null ? void 0 : _a2.value) == null ? void 0 : _b.value;
                const op = mod.target.mod;
                if (successTest(die.value, op, target) && !alreadyReRolled(die.rollId) && !die.rollId.toString().includes(".")) {
                  rerolls.push({
                    groupId,
                    rollId: this.incrementId(die.rollId),
                    sides: die.sides,
                    qty: 1
                  });
                }
              });
              break;
          }
        });
      }
    });
    return rerolls;
  }
  handleTargetCritSuccess(finalResults = []) {
    finalResults.rolls.forEach((roll) => {
      if (roll.successes >= 1 && roll.critical === "success") {
        roll.successes += 1;
        finalResults.value += 1;
      }
    });
  }
  handleTargetCritFailure(finalResults = []) {
    finalResults.rolls.forEach((roll) => {
      if (roll.failures >= 1 && roll.critical === "failure") {
        roll.failures += 1;
        finalResults.value -= 1;
      }
    });
  }
  parseFinalResults(rollResults = []) {
    let allRolls = this.recursiveSearch(rollResults, "rolls");
    const rolls = allRolls.length ? allRolls : [rollResults];
    rolls.forEach((roll) => {
      return Object.entries(roll).forEach(([key, die]) => {
        try {
          let sides = die.sides;
          const diceNotation = /[dD]\d+/i;
          if (typeof sides === "string" && sides.match(diceNotation)) {
            sides = parseInt(die.sides.substring(1));
          }
          if (sides) {
            if (sides === "fate") {
              this.rollsAsFloats.push((die.value + 2) * 0.25);
            } else {
              this.rollsAsFloats.push((die.value - 1) / sides);
            }
          }
        } catch {
          console.error(`This object is not a properly formatted roll object.`, die);
          throw new Error(`Unable to parse final results`);
        }
      });
    });
    const finalResults = this.rollParser.rollParsed(this.parsedNotation);
    if (this.targetRollsCritSuccess && finalResults.success !== null) {
      this.handleTargetCritSuccess(finalResults);
    }
    if (this.targetRollsCritFailure && finalResults.success !== null) {
      this.handleTargetCritFailure(finalResults);
    }
    this.finalResults = finalResults;
    externalCount = 0;
    this.rollsAsFloats = [];
    return finalResults;
  }
};
var ParserInterface_default = ParserInterface;

// node_modules/@3d-dice/dice-ui/src/advancedRoller/advancedRoller.js
var noop = () => {
};
var AdvancedRoller = class {
  constructor(options) {
    this.target = options.target ? document.querySelector(options.target) : document.body;
    this.elem = document.createRange().createContextualFragment(`
			<div class="adv-roller">
				<form class="adv-roller--form">
					<input class="adv-roller--notation" placeholder="2d20kh1" autocomplete="off" />
					<input class="adv-roller--clear" type="reset" value="Clear" />
				</form>
			</div>
		`);
    this.form = this.elem.querySelector(".adv-roller--form");
    this.DRP = new ParserInterface_default({
      targetRollsCritSuccess: (options == null ? void 0 : options.targetRollsCritSuccess) || (options == null ? void 0 : options.targetRollsCritSuccess) || false,
      targetRollsCritFailure: (options == null ? void 0 : options.targetRollsCritFailure) || (options == null ? void 0 : options.targetRollsCrit) || false,
      targetRollsCrit: (options == null ? void 0 : options.targetRollsCrit) || false
    });
    this.onSubmit = (options == null ? void 0 : options.onSubmit) || noop;
    this.onClear = (options == null ? void 0 : options.onClear) || noop;
    this.onReroll = (options == null ? void 0 : options.onReroll) || noop;
    this.onResults = (options == null ? void 0 : options.onResults) || noop;
    this.init();
  }
  init() {
    this.form.addEventListener("submit", this.submitForm.bind(this));
    this.form.addEventListener("reset", this.clear.bind(this));
    this.target.prepend(this.elem);
  }
  submitForm(e) {
    e.preventDefault();
    this.clear();
    this.onSubmit(this.DRP.parseNotation(this.form.firstElementChild.value));
  }
  clear() {
    this.DRP.clear();
    if (this.onClear) {
      this.onClear();
    }
  }
  handleResults(results) {
    const rerolls = this.DRP.handleRerolls(results);
    if (rerolls.length) {
      this.onReroll(rerolls);
      return rerolls;
    }
    const finalResults = this.DRP.parsedNotation ? this.DRP.parseFinalResults(results) : results;
    const event = new CustomEvent("resultsAvailable", { detail: finalResults });
    document.dispatchEvent(event);
    this.onResults(finalResults);
    return finalResults;
  }
};
var advancedRoller_default = AdvancedRoller;

// node_modules/dat.gui/build/dat.gui.module.js
function ___$insertStyle(css2) {
  if (!css2) {
    return;
  }
  if (typeof window === "undefined") {
    return;
  }
  var style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.innerHTML = css2;
  document.head.appendChild(style);
  return css2;
}
function colorToString(color, forceCSSHex) {
  var colorFormat = color.__state.conversionName.toString();
  var r = Math.round(color.r);
  var g = Math.round(color.g);
  var b = Math.round(color.b);
  var a = color.a;
  var h = Math.round(color.h);
  var s = color.s.toFixed(1);
  var v = color.v.toFixed(1);
  if (forceCSSHex || colorFormat === "THREE_CHAR_HEX" || colorFormat === "SIX_CHAR_HEX") {
    var str = color.hex.toString(16);
    while (str.length < 6) {
      str = "0" + str;
    }
    return "#" + str;
  } else if (colorFormat === "CSS_RGB") {
    return "rgb(" + r + "," + g + "," + b + ")";
  } else if (colorFormat === "CSS_RGBA") {
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  } else if (colorFormat === "HEX") {
    return "0x" + color.hex.toString(16);
  } else if (colorFormat === "RGB_ARRAY") {
    return "[" + r + "," + g + "," + b + "]";
  } else if (colorFormat === "RGBA_ARRAY") {
    return "[" + r + "," + g + "," + b + "," + a + "]";
  } else if (colorFormat === "RGB_OBJ") {
    return "{r:" + r + ",g:" + g + ",b:" + b + "}";
  } else if (colorFormat === "RGBA_OBJ") {
    return "{r:" + r + ",g:" + g + ",b:" + b + ",a:" + a + "}";
  } else if (colorFormat === "HSV_OBJ") {
    return "{h:" + h + ",s:" + s + ",v:" + v + "}";
  } else if (colorFormat === "HSVA_OBJ") {
    return "{h:" + h + ",s:" + s + ",v:" + v + ",a:" + a + "}";
  }
  return "unknown format";
}
var ARR_EACH = Array.prototype.forEach;
var ARR_SLICE = Array.prototype.slice;
var Common = {
  BREAK: {},
  extend: function extend(target) {
    this.each(ARR_SLICE.call(arguments, 1), function(obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach((function(key) {
        if (!this.isUndefined(obj[key])) {
          target[key] = obj[key];
        }
      }).bind(this));
    }, this);
    return target;
  },
  defaults: function defaults(target) {
    this.each(ARR_SLICE.call(arguments, 1), function(obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach((function(key) {
        if (this.isUndefined(target[key])) {
          target[key] = obj[key];
        }
      }).bind(this));
    }, this);
    return target;
  },
  compose: function compose() {
    var toCall = ARR_SLICE.call(arguments);
    return function() {
      var args = ARR_SLICE.call(arguments);
      for (var i = toCall.length - 1; i >= 0; i--) {
        args = [toCall[i].apply(this, args)];
      }
      return args[0];
    };
  },
  each: function each(obj, itr, scope) {
    if (!obj) {
      return;
    }
    if (ARR_EACH && obj.forEach && obj.forEach === ARR_EACH) {
      obj.forEach(itr, scope);
    } else if (obj.length === obj.length + 0) {
      var key = void 0;
      var l = void 0;
      for (key = 0, l = obj.length; key < l; key++) {
        if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
          return;
        }
      }
    } else {
      for (var _key in obj) {
        if (itr.call(scope, obj[_key], _key) === this.BREAK) {
          return;
        }
      }
    }
  },
  defer: function defer(fnc) {
    setTimeout(fnc, 0);
  },
  debounce: function debounce(func, threshold, callImmediately) {
    var timeout = void 0;
    return function() {
      var obj = this;
      var args = arguments;
      function delayed() {
        timeout = null;
        if (!callImmediately) func.apply(obj, args);
      }
      var callNow = callImmediately || !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(delayed, threshold);
      if (callNow) {
        func.apply(obj, args);
      }
    };
  },
  toArray: function toArray(obj) {
    if (obj.toArray) return obj.toArray();
    return ARR_SLICE.call(obj);
  },
  isUndefined: function isUndefined(obj) {
    return obj === void 0;
  },
  isNull: function isNull(obj) {
    return obj === null;
  },
  isNaN: function(_isNaN) {
    function isNaN2(_x) {
      return _isNaN.apply(this, arguments);
    }
    isNaN2.toString = function() {
      return _isNaN.toString();
    };
    return isNaN2;
  }(function(obj) {
    return isNaN(obj);
  }),
  isArray: Array.isArray || function(obj) {
    return obj.constructor === Array;
  },
  isObject: function isObject(obj) {
    return obj === Object(obj);
  },
  isNumber: function isNumber(obj) {
    return obj === obj + 0;
  },
  isString: function isString(obj) {
    return obj === obj + "";
  },
  isBoolean: function isBoolean(obj) {
    return obj === false || obj === true;
  },
  isFunction: function isFunction(obj) {
    return obj instanceof Function;
  }
};
var INTERPRETATIONS = [
  {
    litmus: Common.isString,
    conversions: {
      THREE_CHAR_HEX: {
        read: function read(original) {
          var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
          if (test === null) {
            return false;
          }
          return {
            space: "HEX",
            hex: parseInt("0x" + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
          };
        },
        write: colorToString
      },
      SIX_CHAR_HEX: {
        read: function read2(original) {
          var test = original.match(/^#([A-F0-9]{6})$/i);
          if (test === null) {
            return false;
          }
          return {
            space: "HEX",
            hex: parseInt("0x" + test[1].toString(), 0)
          };
        },
        write: colorToString
      },
      CSS_RGB: {
        read: function read3(original) {
          var test = original.match(/^rgb\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/);
          if (test === null) {
            return false;
          }
          return {
            space: "RGB",
            r: parseFloat(test[1]),
            g: parseFloat(test[2]),
            b: parseFloat(test[3])
          };
        },
        write: colorToString
      },
      CSS_RGBA: {
        read: function read4(original) {
          var test = original.match(/^rgba\(\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*,\s*(\S+)\s*\)/);
          if (test === null) {
            return false;
          }
          return {
            space: "RGB",
            r: parseFloat(test[1]),
            g: parseFloat(test[2]),
            b: parseFloat(test[3]),
            a: parseFloat(test[4])
          };
        },
        write: colorToString
      }
    }
  },
  {
    litmus: Common.isNumber,
    conversions: {
      HEX: {
        read: function read5(original) {
          return {
            space: "HEX",
            hex: original,
            conversionName: "HEX"
          };
        },
        write: function write(color) {
          return color.hex;
        }
      }
    }
  },
  {
    litmus: Common.isArray,
    conversions: {
      RGB_ARRAY: {
        read: function read6(original) {
          if (original.length !== 3) {
            return false;
          }
          return {
            space: "RGB",
            r: original[0],
            g: original[1],
            b: original[2]
          };
        },
        write: function write2(color) {
          return [color.r, color.g, color.b];
        }
      },
      RGBA_ARRAY: {
        read: function read7(original) {
          if (original.length !== 4) return false;
          return {
            space: "RGB",
            r: original[0],
            g: original[1],
            b: original[2],
            a: original[3]
          };
        },
        write: function write3(color) {
          return [color.r, color.g, color.b, color.a];
        }
      }
    }
  },
  {
    litmus: Common.isObject,
    conversions: {
      RGBA_OBJ: {
        read: function read8(original) {
          if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b) && Common.isNumber(original.a)) {
            return {
              space: "RGB",
              r: original.r,
              g: original.g,
              b: original.b,
              a: original.a
            };
          }
          return false;
        },
        write: function write4(color) {
          return {
            r: color.r,
            g: color.g,
            b: color.b,
            a: color.a
          };
        }
      },
      RGB_OBJ: {
        read: function read9(original) {
          if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b)) {
            return {
              space: "RGB",
              r: original.r,
              g: original.g,
              b: original.b
            };
          }
          return false;
        },
        write: function write5(color) {
          return {
            r: color.r,
            g: color.g,
            b: color.b
          };
        }
      },
      HSVA_OBJ: {
        read: function read10(original) {
          if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v) && Common.isNumber(original.a)) {
            return {
              space: "HSV",
              h: original.h,
              s: original.s,
              v: original.v,
              a: original.a
            };
          }
          return false;
        },
        write: function write6(color) {
          return {
            h: color.h,
            s: color.s,
            v: color.v,
            a: color.a
          };
        }
      },
      HSV_OBJ: {
        read: function read11(original) {
          if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v)) {
            return {
              space: "HSV",
              h: original.h,
              s: original.s,
              v: original.v
            };
          }
          return false;
        },
        write: function write7(color) {
          return {
            h: color.h,
            s: color.s,
            v: color.v
          };
        }
      }
    }
  }
];
var result = void 0;
var toReturn = void 0;
var interpret = function interpret2() {
  toReturn = false;
  var original = arguments.length > 1 ? Common.toArray(arguments) : arguments[0];
  Common.each(INTERPRETATIONS, function(family) {
    if (family.litmus(original)) {
      Common.each(family.conversions, function(conversion, conversionName) {
        result = conversion.read(original);
        if (toReturn === false && result !== false) {
          toReturn = result;
          result.conversionName = conversionName;
          result.conversion = conversion;
          return Common.BREAK;
        }
      });
      return Common.BREAK;
    }
  });
  return toReturn;
};
var tmpComponent = void 0;
var ColorMath = {
  hsv_to_rgb: function hsv_to_rgb(h, s, v) {
    var hi = Math.floor(h / 60) % 6;
    var f = h / 60 - Math.floor(h / 60);
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
    return {
      r: c[0] * 255,
      g: c[1] * 255,
      b: c[2] * 255
    };
  },
  rgb_to_hsv: function rgb_to_hsv(r, g, b) {
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h = void 0;
    var s = void 0;
    if (max !== 0) {
      s = delta / max;
    } else {
      return {
        h: NaN,
        s: 0,
        v: 0
      };
    }
    if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }
    h /= 6;
    if (h < 0) {
      h += 1;
    }
    return {
      h: h * 360,
      s,
      v: max / 255
    };
  },
  rgb_to_hex: function rgb_to_hex(r, g, b) {
    var hex = this.hex_with_component(0, 2, r);
    hex = this.hex_with_component(hex, 1, g);
    hex = this.hex_with_component(hex, 0, b);
    return hex;
  },
  component_from_hex: function component_from_hex(hex, componentIndex) {
    return hex >> componentIndex * 8 & 255;
  },
  hex_with_component: function hex_with_component(hex, componentIndex, value) {
    return value << (tmpComponent = componentIndex * 8) | hex & ~(255 << tmpComponent);
  }
};
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
  return typeof obj;
} : function(obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};
var classCallCheck = function(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
var createClass = /* @__PURE__ */ function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var get = function get2(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);
  if (desc === void 0) {
    var parent = Object.getPrototypeOf(object);
    if (parent === null) {
      return void 0;
    } else {
      return get2(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;
    if (getter === void 0) {
      return void 0;
    }
    return getter.call(receiver);
  }
};
var inherits = function(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};
var possibleConstructorReturn = function(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};
var Color = function() {
  function Color2() {
    classCallCheck(this, Color2);
    this.__state = interpret.apply(this, arguments);
    if (this.__state === false) {
      throw new Error("Failed to interpret color arguments");
    }
    this.__state.a = this.__state.a || 1;
  }
  createClass(Color2, [{
    key: "toString",
    value: function toString() {
      return colorToString(this);
    }
  }, {
    key: "toHexString",
    value: function toHexString() {
      return colorToString(this, true);
    }
  }, {
    key: "toOriginal",
    value: function toOriginal() {
      return this.__state.conversion.write(this);
    }
  }]);
  return Color2;
}();
function defineRGBComponent(target, component, componentHexIndex) {
  Object.defineProperty(target, component, {
    get: function get$$13() {
      if (this.__state.space === "RGB") {
        return this.__state[component];
      }
      Color.recalculateRGB(this, component, componentHexIndex);
      return this.__state[component];
    },
    set: function set$$13(v) {
      if (this.__state.space !== "RGB") {
        Color.recalculateRGB(this, component, componentHexIndex);
        this.__state.space = "RGB";
      }
      this.__state[component] = v;
    }
  });
}
function defineHSVComponent(target, component) {
  Object.defineProperty(target, component, {
    get: function get$$13() {
      if (this.__state.space === "HSV") {
        return this.__state[component];
      }
      Color.recalculateHSV(this);
      return this.__state[component];
    },
    set: function set$$13(v) {
      if (this.__state.space !== "HSV") {
        Color.recalculateHSV(this);
        this.__state.space = "HSV";
      }
      this.__state[component] = v;
    }
  });
}
Color.recalculateRGB = function(color, component, componentHexIndex) {
  if (color.__state.space === "HEX") {
    color.__state[component] = ColorMath.component_from_hex(color.__state.hex, componentHexIndex);
  } else if (color.__state.space === "HSV") {
    Common.extend(color.__state, ColorMath.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
  } else {
    throw new Error("Corrupted color state");
  }
};
Color.recalculateHSV = function(color) {
  var result2 = ColorMath.rgb_to_hsv(color.r, color.g, color.b);
  Common.extend(color.__state, {
    s: result2.s,
    v: result2.v
  });
  if (!Common.isNaN(result2.h)) {
    color.__state.h = result2.h;
  } else if (Common.isUndefined(color.__state.h)) {
    color.__state.h = 0;
  }
};
Color.COMPONENTS = ["r", "g", "b", "h", "s", "v", "hex", "a"];
defineRGBComponent(Color.prototype, "r", 2);
defineRGBComponent(Color.prototype, "g", 1);
defineRGBComponent(Color.prototype, "b", 0);
defineHSVComponent(Color.prototype, "h");
defineHSVComponent(Color.prototype, "s");
defineHSVComponent(Color.prototype, "v");
Object.defineProperty(Color.prototype, "a", {
  get: function get$$1() {
    return this.__state.a;
  },
  set: function set$$1(v) {
    this.__state.a = v;
  }
});
Object.defineProperty(Color.prototype, "hex", {
  get: function get$$12() {
    if (this.__state.space !== "HEX") {
      this.__state.hex = ColorMath.rgb_to_hex(this.r, this.g, this.b);
      this.__state.space = "HEX";
    }
    return this.__state.hex;
  },
  set: function set$$12(v) {
    this.__state.space = "HEX";
    this.__state.hex = v;
  }
});
var Controller = function() {
  function Controller2(object, property) {
    classCallCheck(this, Controller2);
    this.initialValue = object[property];
    this.domElement = document.createElement("div");
    this.object = object;
    this.property = property;
    this.__onChange = void 0;
    this.__onFinishChange = void 0;
  }
  createClass(Controller2, [{
    key: "onChange",
    value: function onChange(fnc) {
      this.__onChange = fnc;
      return this;
    }
  }, {
    key: "onFinishChange",
    value: function onFinishChange(fnc) {
      this.__onFinishChange = fnc;
      return this;
    }
  }, {
    key: "setValue",
    value: function setValue(newValue) {
      this.object[this.property] = newValue;
      if (this.__onChange) {
        this.__onChange.call(this, newValue);
      }
      this.updateDisplay();
      return this;
    }
  }, {
    key: "getValue",
    value: function getValue() {
      return this.object[this.property];
    }
  }, {
    key: "updateDisplay",
    value: function updateDisplay2() {
      return this;
    }
  }, {
    key: "isModified",
    value: function isModified() {
      return this.initialValue !== this.getValue();
    }
  }]);
  return Controller2;
}();
var EVENT_MAP = {
  HTMLEvents: ["change"],
  MouseEvents: ["click", "mousemove", "mousedown", "mouseup", "mouseover"],
  KeyboardEvents: ["keydown"]
};
var EVENT_MAP_INV = {};
Common.each(EVENT_MAP, function(v, k) {
  Common.each(v, function(e) {
    EVENT_MAP_INV[e] = k;
  });
});
var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;
function cssValueToPixels(val) {
  if (val === "0" || Common.isUndefined(val)) {
    return 0;
  }
  var match = val.match(CSS_VALUE_PIXELS);
  if (!Common.isNull(match)) {
    return parseFloat(match[1]);
  }
  return 0;
}
var dom = {
  makeSelectable: function makeSelectable(elem, selectable) {
    if (elem === void 0 || elem.style === void 0) return;
    elem.onselectstart = selectable ? function() {
      return false;
    } : function() {
    };
    elem.style.MozUserSelect = selectable ? "auto" : "none";
    elem.style.KhtmlUserSelect = selectable ? "auto" : "none";
    elem.unselectable = selectable ? "on" : "off";
  },
  makeFullscreen: function makeFullscreen(elem, hor, vert) {
    var vertical = vert;
    var horizontal = hor;
    if (Common.isUndefined(horizontal)) {
      horizontal = true;
    }
    if (Common.isUndefined(vertical)) {
      vertical = true;
    }
    elem.style.position = "absolute";
    if (horizontal) {
      elem.style.left = 0;
      elem.style.right = 0;
    }
    if (vertical) {
      elem.style.top = 0;
      elem.style.bottom = 0;
    }
  },
  fakeEvent: function fakeEvent(elem, eventType, pars, aux) {
    var params = pars || {};
    var className = EVENT_MAP_INV[eventType];
    if (!className) {
      throw new Error("Event type " + eventType + " not supported.");
    }
    var evt = document.createEvent(className);
    switch (className) {
      case "MouseEvents": {
        var clientX = params.x || params.clientX || 0;
        var clientY = params.y || params.clientY || 0;
        evt.initMouseEvent(
          eventType,
          params.bubbles || false,
          params.cancelable || true,
          window,
          params.clickCount || 1,
          0,
          0,
          clientX,
          clientY,
          false,
          false,
          false,
          false,
          0,
          null
        );
        break;
      }
      case "KeyboardEvents": {
        var init = evt.initKeyboardEvent || evt.initKeyEvent;
        Common.defaults(params, {
          cancelable: true,
          ctrlKey: false,
          altKey: false,
          shiftKey: false,
          metaKey: false,
          keyCode: void 0,
          charCode: void 0
        });
        init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
        break;
      }
      default: {
        evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
        break;
      }
    }
    Common.defaults(evt, aux);
    elem.dispatchEvent(evt);
  },
  bind: function bind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.addEventListener) {
      elem.addEventListener(event, func, bool);
    } else if (elem.attachEvent) {
      elem.attachEvent("on" + event, func);
    }
    return dom;
  },
  unbind: function unbind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.removeEventListener) {
      elem.removeEventListener(event, func, bool);
    } else if (elem.detachEvent) {
      elem.detachEvent("on" + event, func);
    }
    return dom;
  },
  addClass: function addClass(elem, className) {
    if (elem.className === void 0) {
      elem.className = className;
    } else if (elem.className !== className) {
      var classes = elem.className.split(/ +/);
      if (classes.indexOf(className) === -1) {
        classes.push(className);
        elem.className = classes.join(" ").replace(/^\s+/, "").replace(/\s+$/, "");
      }
    }
    return dom;
  },
  removeClass: function removeClass(elem, className) {
    if (className) {
      if (elem.className === className) {
        elem.removeAttribute("class");
      } else {
        var classes = elem.className.split(/ +/);
        var index = classes.indexOf(className);
        if (index !== -1) {
          classes.splice(index, 1);
          elem.className = classes.join(" ");
        }
      }
    } else {
      elem.className = void 0;
    }
    return dom;
  },
  hasClass: function hasClass(elem, className) {
    return new RegExp("(?:^|\\s+)" + className + "(?:\\s+|$)").test(elem.className) || false;
  },
  getWidth: function getWidth(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style["border-left-width"]) + cssValueToPixels(style["border-right-width"]) + cssValueToPixels(style["padding-left"]) + cssValueToPixels(style["padding-right"]) + cssValueToPixels(style.width);
  },
  getHeight: function getHeight(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style["border-top-width"]) + cssValueToPixels(style["border-bottom-width"]) + cssValueToPixels(style["padding-top"]) + cssValueToPixels(style["padding-bottom"]) + cssValueToPixels(style.height);
  },
  getOffset: function getOffset(el) {
    var elem = el;
    var offset = { left: 0, top: 0 };
    if (elem.offsetParent) {
      do {
        offset.left += elem.offsetLeft;
        offset.top += elem.offsetTop;
        elem = elem.offsetParent;
      } while (elem);
    }
    return offset;
  },
  isActive: function isActive(elem) {
    return elem === document.activeElement && (elem.type || elem.href);
  }
};
var BooleanController = function(_Controller) {
  inherits(BooleanController2, _Controller);
  function BooleanController2(object, property) {
    classCallCheck(this, BooleanController2);
    var _this2 = possibleConstructorReturn(this, (BooleanController2.__proto__ || Object.getPrototypeOf(BooleanController2)).call(this, object, property));
    var _this = _this2;
    _this2.__prev = _this2.getValue();
    _this2.__checkbox = document.createElement("input");
    _this2.__checkbox.setAttribute("type", "checkbox");
    function onChange() {
      _this.setValue(!_this.__prev);
    }
    dom.bind(_this2.__checkbox, "change", onChange, false);
    _this2.domElement.appendChild(_this2.__checkbox);
    _this2.updateDisplay();
    return _this2;
  }
  createClass(BooleanController2, [{
    key: "setValue",
    value: function setValue(v) {
      var toReturn2 = get(BooleanController2.prototype.__proto__ || Object.getPrototypeOf(BooleanController2.prototype), "setValue", this).call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      this.__prev = this.getValue();
      return toReturn2;
    }
  }, {
    key: "updateDisplay",
    value: function updateDisplay2() {
      if (this.getValue() === true) {
        this.__checkbox.setAttribute("checked", "checked");
        this.__checkbox.checked = true;
        this.__prev = true;
      } else {
        this.__checkbox.checked = false;
        this.__prev = false;
      }
      return get(BooleanController2.prototype.__proto__ || Object.getPrototypeOf(BooleanController2.prototype), "updateDisplay", this).call(this);
    }
  }]);
  return BooleanController2;
}(Controller);
var OptionController = function(_Controller) {
  inherits(OptionController2, _Controller);
  function OptionController2(object, property, opts) {
    classCallCheck(this, OptionController2);
    var _this2 = possibleConstructorReturn(this, (OptionController2.__proto__ || Object.getPrototypeOf(OptionController2)).call(this, object, property));
    var options = opts;
    var _this = _this2;
    _this2.__select = document.createElement("select");
    if (Common.isArray(options)) {
      var map2 = {};
      Common.each(options, function(element) {
        map2[element] = element;
      });
      options = map2;
    }
    Common.each(options, function(value, key) {
      var opt = document.createElement("option");
      opt.innerHTML = key;
      opt.setAttribute("value", value);
      _this.__select.appendChild(opt);
    });
    _this2.updateDisplay();
    dom.bind(_this2.__select, "change", function() {
      var desiredValue = this.options[this.selectedIndex].value;
      _this.setValue(desiredValue);
    });
    _this2.domElement.appendChild(_this2.__select);
    return _this2;
  }
  createClass(OptionController2, [{
    key: "setValue",
    value: function setValue(v) {
      var toReturn2 = get(OptionController2.prototype.__proto__ || Object.getPrototypeOf(OptionController2.prototype), "setValue", this).call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      return toReturn2;
    }
  }, {
    key: "updateDisplay",
    value: function updateDisplay2() {
      if (dom.isActive(this.__select)) return this;
      this.__select.value = this.getValue();
      return get(OptionController2.prototype.__proto__ || Object.getPrototypeOf(OptionController2.prototype), "updateDisplay", this).call(this);
    }
  }]);
  return OptionController2;
}(Controller);
var StringController = function(_Controller) {
  inherits(StringController2, _Controller);
  function StringController2(object, property) {
    classCallCheck(this, StringController2);
    var _this2 = possibleConstructorReturn(this, (StringController2.__proto__ || Object.getPrototypeOf(StringController2)).call(this, object, property));
    var _this = _this2;
    function onChange() {
      _this.setValue(_this.__input.value);
    }
    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    _this2.__input = document.createElement("input");
    _this2.__input.setAttribute("type", "text");
    dom.bind(_this2.__input, "keyup", onChange);
    dom.bind(_this2.__input, "change", onChange);
    dom.bind(_this2.__input, "blur", onBlur);
    dom.bind(_this2.__input, "keydown", function(e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });
    _this2.updateDisplay();
    _this2.domElement.appendChild(_this2.__input);
    return _this2;
  }
  createClass(StringController2, [{
    key: "updateDisplay",
    value: function updateDisplay2() {
      if (!dom.isActive(this.__input)) {
        this.__input.value = this.getValue();
      }
      return get(StringController2.prototype.__proto__ || Object.getPrototypeOf(StringController2.prototype), "updateDisplay", this).call(this);
    }
  }]);
  return StringController2;
}(Controller);
function numDecimals(x) {
  var _x = x.toString();
  if (_x.indexOf(".") > -1) {
    return _x.length - _x.indexOf(".") - 1;
  }
  return 0;
}
var NumberController = function(_Controller) {
  inherits(NumberController2, _Controller);
  function NumberController2(object, property, params) {
    classCallCheck(this, NumberController2);
    var _this = possibleConstructorReturn(this, (NumberController2.__proto__ || Object.getPrototypeOf(NumberController2)).call(this, object, property));
    var _params = params || {};
    _this.__min = _params.min;
    _this.__max = _params.max;
    _this.__step = _params.step;
    if (Common.isUndefined(_this.__step)) {
      if (_this.initialValue === 0) {
        _this.__impliedStep = 1;
      } else {
        _this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(_this.initialValue)) / Math.LN10)) / 10;
      }
    } else {
      _this.__impliedStep = _this.__step;
    }
    _this.__precision = numDecimals(_this.__impliedStep);
    return _this;
  }
  createClass(NumberController2, [{
    key: "setValue",
    value: function setValue(v) {
      var _v = v;
      if (this.__min !== void 0 && _v < this.__min) {
        _v = this.__min;
      } else if (this.__max !== void 0 && _v > this.__max) {
        _v = this.__max;
      }
      if (this.__step !== void 0 && _v % this.__step !== 0) {
        _v = Math.round(_v / this.__step) * this.__step;
      }
      return get(NumberController2.prototype.__proto__ || Object.getPrototypeOf(NumberController2.prototype), "setValue", this).call(this, _v);
    }
  }, {
    key: "min",
    value: function min(minValue) {
      this.__min = minValue;
      return this;
    }
  }, {
    key: "max",
    value: function max(maxValue) {
      this.__max = maxValue;
      return this;
    }
  }, {
    key: "step",
    value: function step(stepValue) {
      this.__step = stepValue;
      this.__impliedStep = stepValue;
      this.__precision = numDecimals(stepValue);
      return this;
    }
  }]);
  return NumberController2;
}(Controller);
function roundToDecimal(value, decimals) {
  var tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}
var NumberControllerBox = function(_NumberController) {
  inherits(NumberControllerBox2, _NumberController);
  function NumberControllerBox2(object, property, params) {
    classCallCheck(this, NumberControllerBox2);
    var _this2 = possibleConstructorReturn(this, (NumberControllerBox2.__proto__ || Object.getPrototypeOf(NumberControllerBox2)).call(this, object, property, params));
    _this2.__truncationSuspended = false;
    var _this = _this2;
    var prevY = void 0;
    function onChange() {
      var attempted = parseFloat(_this.__input.value);
      if (!Common.isNaN(attempted)) {
        _this.setValue(attempted);
      }
    }
    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onBlur() {
      onFinish();
    }
    function onMouseDrag(e) {
      var diff = prevY - e.clientY;
      _this.setValue(_this.getValue() + diff * _this.__impliedStep);
      prevY = e.clientY;
    }
    function onMouseUp() {
      dom.unbind(window, "mousemove", onMouseDrag);
      dom.unbind(window, "mouseup", onMouseUp);
      onFinish();
    }
    function onMouseDown(e) {
      dom.bind(window, "mousemove", onMouseDrag);
      dom.bind(window, "mouseup", onMouseUp);
      prevY = e.clientY;
    }
    _this2.__input = document.createElement("input");
    _this2.__input.setAttribute("type", "text");
    dom.bind(_this2.__input, "change", onChange);
    dom.bind(_this2.__input, "blur", onBlur);
    dom.bind(_this2.__input, "mousedown", onMouseDown);
    dom.bind(_this2.__input, "keydown", function(e) {
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
        onFinish();
      }
    });
    _this2.updateDisplay();
    _this2.domElement.appendChild(_this2.__input);
    return _this2;
  }
  createClass(NumberControllerBox2, [{
    key: "updateDisplay",
    value: function updateDisplay2() {
      this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
      return get(NumberControllerBox2.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox2.prototype), "updateDisplay", this).call(this);
    }
  }]);
  return NumberControllerBox2;
}(NumberController);
function map(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}
var NumberControllerSlider = function(_NumberController) {
  inherits(NumberControllerSlider2, _NumberController);
  function NumberControllerSlider2(object, property, min, max, step) {
    classCallCheck(this, NumberControllerSlider2);
    var _this2 = possibleConstructorReturn(this, (NumberControllerSlider2.__proto__ || Object.getPrototypeOf(NumberControllerSlider2)).call(this, object, property, { min, max, step }));
    var _this = _this2;
    _this2.__background = document.createElement("div");
    _this2.__foreground = document.createElement("div");
    dom.bind(_this2.__background, "mousedown", onMouseDown);
    dom.bind(_this2.__background, "touchstart", onTouchStart);
    dom.addClass(_this2.__background, "slider");
    dom.addClass(_this2.__foreground, "slider-fg");
    function onMouseDown(e) {
      document.activeElement.blur();
      dom.bind(window, "mousemove", onMouseDrag);
      dom.bind(window, "mouseup", onMouseUp);
      onMouseDrag(e);
    }
    function onMouseDrag(e) {
      e.preventDefault();
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
      return false;
    }
    function onMouseUp() {
      dom.unbind(window, "mousemove", onMouseDrag);
      dom.unbind(window, "mouseup", onMouseUp);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onTouchStart(e) {
      if (e.touches.length !== 1) {
        return;
      }
      dom.bind(window, "touchmove", onTouchMove);
      dom.bind(window, "touchend", onTouchEnd);
      onTouchMove(e);
    }
    function onTouchMove(e) {
      var clientX = e.touches[0].clientX;
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
    }
    function onTouchEnd() {
      dom.unbind(window, "touchmove", onTouchMove);
      dom.unbind(window, "touchend", onTouchEnd);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    _this2.updateDisplay();
    _this2.__background.appendChild(_this2.__foreground);
    _this2.domElement.appendChild(_this2.__background);
    return _this2;
  }
  createClass(NumberControllerSlider2, [{
    key: "updateDisplay",
    value: function updateDisplay2() {
      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);
      this.__foreground.style.width = pct * 100 + "%";
      return get(NumberControllerSlider2.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider2.prototype), "updateDisplay", this).call(this);
    }
  }]);
  return NumberControllerSlider2;
}(NumberController);
var FunctionController = function(_Controller) {
  inherits(FunctionController2, _Controller);
  function FunctionController2(object, property, text) {
    classCallCheck(this, FunctionController2);
    var _this2 = possibleConstructorReturn(this, (FunctionController2.__proto__ || Object.getPrototypeOf(FunctionController2)).call(this, object, property));
    var _this = _this2;
    _this2.__button = document.createElement("div");
    _this2.__button.innerHTML = text === void 0 ? "Fire" : text;
    dom.bind(_this2.__button, "click", function(e) {
      e.preventDefault();
      _this.fire();
      return false;
    });
    dom.addClass(_this2.__button, "button");
    _this2.domElement.appendChild(_this2.__button);
    return _this2;
  }
  createClass(FunctionController2, [{
    key: "fire",
    value: function fire() {
      if (this.__onChange) {
        this.__onChange.call(this);
      }
      this.getValue().call(this.object);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
    }
  }]);
  return FunctionController2;
}(Controller);
var ColorController = function(_Controller) {
  inherits(ColorController2, _Controller);
  function ColorController2(object, property) {
    classCallCheck(this, ColorController2);
    var _this2 = possibleConstructorReturn(this, (ColorController2.__proto__ || Object.getPrototypeOf(ColorController2)).call(this, object, property));
    _this2.__color = new Color(_this2.getValue());
    _this2.__temp = new Color(0);
    var _this = _this2;
    _this2.domElement = document.createElement("div");
    dom.makeSelectable(_this2.domElement, false);
    _this2.__selector = document.createElement("div");
    _this2.__selector.className = "selector";
    _this2.__saturation_field = document.createElement("div");
    _this2.__saturation_field.className = "saturation-field";
    _this2.__field_knob = document.createElement("div");
    _this2.__field_knob.className = "field-knob";
    _this2.__field_knob_border = "2px solid ";
    _this2.__hue_knob = document.createElement("div");
    _this2.__hue_knob.className = "hue-knob";
    _this2.__hue_field = document.createElement("div");
    _this2.__hue_field.className = "hue-field";
    _this2.__input = document.createElement("input");
    _this2.__input.type = "text";
    _this2.__input_textShadow = "0 1px 1px ";
    dom.bind(_this2.__input, "keydown", function(e) {
      if (e.keyCode === 13) {
        onBlur.call(this);
      }
    });
    dom.bind(_this2.__input, "blur", onBlur);
    dom.bind(_this2.__selector, "mousedown", function() {
      dom.addClass(this, "drag").bind(window, "mouseup", function() {
        dom.removeClass(_this.__selector, "drag");
      });
    });
    dom.bind(_this2.__selector, "touchstart", function() {
      dom.addClass(this, "drag").bind(window, "touchend", function() {
        dom.removeClass(_this.__selector, "drag");
      });
    });
    var valueField = document.createElement("div");
    Common.extend(_this2.__selector.style, {
      width: "122px",
      height: "102px",
      padding: "3px",
      backgroundColor: "#222",
      boxShadow: "0px 1px 3px rgba(0,0,0,0.3)"
    });
    Common.extend(_this2.__field_knob.style, {
      position: "absolute",
      width: "12px",
      height: "12px",
      border: _this2.__field_knob_border + (_this2.__color.v < 0.5 ? "#fff" : "#000"),
      boxShadow: "0px 1px 3px rgba(0,0,0,0.5)",
      borderRadius: "12px",
      zIndex: 1
    });
    Common.extend(_this2.__hue_knob.style, {
      position: "absolute",
      width: "15px",
      height: "2px",
      borderRight: "4px solid #fff",
      zIndex: 1
    });
    Common.extend(_this2.__saturation_field.style, {
      width: "100px",
      height: "100px",
      border: "1px solid #555",
      marginRight: "3px",
      display: "inline-block",
      cursor: "pointer"
    });
    Common.extend(valueField.style, {
      width: "100%",
      height: "100%",
      background: "none"
    });
    linearGradient(valueField, "top", "rgba(0,0,0,0)", "#000");
    Common.extend(_this2.__hue_field.style, {
      width: "15px",
      height: "100px",
      border: "1px solid #555",
      cursor: "ns-resize",
      position: "absolute",
      top: "3px",
      right: "3px"
    });
    hueGradient(_this2.__hue_field);
    Common.extend(_this2.__input.style, {
      outline: "none",
      textAlign: "center",
      color: "#fff",
      border: 0,
      fontWeight: "bold",
      textShadow: _this2.__input_textShadow + "rgba(0,0,0,0.7)"
    });
    dom.bind(_this2.__saturation_field, "mousedown", fieldDown);
    dom.bind(_this2.__saturation_field, "touchstart", fieldDown);
    dom.bind(_this2.__field_knob, "mousedown", fieldDown);
    dom.bind(_this2.__field_knob, "touchstart", fieldDown);
    dom.bind(_this2.__hue_field, "mousedown", fieldDownH);
    dom.bind(_this2.__hue_field, "touchstart", fieldDownH);
    function fieldDown(e) {
      setSV(e);
      dom.bind(window, "mousemove", setSV);
      dom.bind(window, "touchmove", setSV);
      dom.bind(window, "mouseup", fieldUpSV);
      dom.bind(window, "touchend", fieldUpSV);
    }
    function fieldDownH(e) {
      setH(e);
      dom.bind(window, "mousemove", setH);
      dom.bind(window, "touchmove", setH);
      dom.bind(window, "mouseup", fieldUpH);
      dom.bind(window, "touchend", fieldUpH);
    }
    function fieldUpSV() {
      dom.unbind(window, "mousemove", setSV);
      dom.unbind(window, "touchmove", setSV);
      dom.unbind(window, "mouseup", fieldUpSV);
      dom.unbind(window, "touchend", fieldUpSV);
      onFinish();
    }
    function fieldUpH() {
      dom.unbind(window, "mousemove", setH);
      dom.unbind(window, "touchmove", setH);
      dom.unbind(window, "mouseup", fieldUpH);
      dom.unbind(window, "touchend", fieldUpH);
      onFinish();
    }
    function onBlur() {
      var i = interpret(this.value);
      if (i !== false) {
        _this.__color.__state = i;
        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }
    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.__color.toOriginal());
      }
    }
    _this2.__saturation_field.appendChild(valueField);
    _this2.__selector.appendChild(_this2.__field_knob);
    _this2.__selector.appendChild(_this2.__saturation_field);
    _this2.__selector.appendChild(_this2.__hue_field);
    _this2.__hue_field.appendChild(_this2.__hue_knob);
    _this2.domElement.appendChild(_this2.__input);
    _this2.domElement.appendChild(_this2.__selector);
    _this2.updateDisplay();
    function setSV(e) {
      if (e.type.indexOf("touch") === -1) {
        e.preventDefault();
      }
      var fieldRect = _this.__saturation_field.getBoundingClientRect();
      var _ref = e.touches && e.touches[0] || e, clientX = _ref.clientX, clientY = _ref.clientY;
      var s = (clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
      var v = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
      if (v > 1) {
        v = 1;
      } else if (v < 0) {
        v = 0;
      }
      if (s > 1) {
        s = 1;
      } else if (s < 0) {
        s = 0;
      }
      _this.__color.v = v;
      _this.__color.s = s;
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
    function setH(e) {
      if (e.type.indexOf("touch") === -1) {
        e.preventDefault();
      }
      var fieldRect = _this.__hue_field.getBoundingClientRect();
      var _ref2 = e.touches && e.touches[0] || e, clientY = _ref2.clientY;
      var h = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
      if (h > 1) {
        h = 1;
      } else if (h < 0) {
        h = 0;
      }
      _this.__color.h = h * 360;
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
    return _this2;
  }
  createClass(ColorController2, [{
    key: "updateDisplay",
    value: function updateDisplay2() {
      var i = interpret(this.getValue());
      if (i !== false) {
        var mismatch = false;
        Common.each(Color.COMPONENTS, function(component) {
          if (!Common.isUndefined(i[component]) && !Common.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
            mismatch = true;
            return {};
          }
        }, this);
        if (mismatch) {
          Common.extend(this.__color.__state, i);
        }
      }
      Common.extend(this.__temp.__state, this.__color.__state);
      this.__temp.a = 1;
      var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;
      var _flip = 255 - flip;
      Common.extend(this.__field_knob.style, {
        marginLeft: 100 * this.__color.s - 7 + "px",
        marginTop: 100 * (1 - this.__color.v) - 7 + "px",
        backgroundColor: this.__temp.toHexString(),
        border: this.__field_knob_border + "rgb(" + flip + "," + flip + "," + flip + ")"
      });
      this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + "px";
      this.__temp.s = 1;
      this.__temp.v = 1;
      linearGradient(this.__saturation_field, "left", "#fff", this.__temp.toHexString());
      this.__input.value = this.__color.toString();
      Common.extend(this.__input.style, {
        backgroundColor: this.__color.toHexString(),
        color: "rgb(" + flip + "," + flip + "," + flip + ")",
        textShadow: this.__input_textShadow + "rgba(" + _flip + "," + _flip + "," + _flip + ",.7)"
      });
    }
  }]);
  return ColorController2;
}(Controller);
var vendors = ["-moz-", "-o-", "-webkit-", "-ms-", ""];
function linearGradient(elem, x, a, b) {
  elem.style.background = "";
  Common.each(vendors, function(vendor) {
    elem.style.cssText += "background: " + vendor + "linear-gradient(" + x + ", " + a + " 0%, " + b + " 100%); ";
  });
}
function hueGradient(elem) {
  elem.style.background = "";
  elem.style.cssText += "background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);";
  elem.style.cssText += "background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";
  elem.style.cssText += "background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";
  elem.style.cssText += "background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";
  elem.style.cssText += "background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";
}
var css = {
  load: function load(url, indoc) {
    var doc = indoc || document;
    var link = doc.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    doc.getElementsByTagName("head")[0].appendChild(link);
  },
  inject: function inject(cssContent, indoc) {
    var doc = indoc || document;
    var injected = document.createElement("style");
    injected.type = "text/css";
    injected.innerHTML = cssContent;
    var head = doc.getElementsByTagName("head")[0];
    try {
      head.appendChild(injected);
    } catch (e) {
    }
  }
};
var saveDialogContents = `<div id="dg-save" class="dg dialogue">

  Here's the new load parameter for your <code>GUI</code>'s constructor:

  <textarea id="dg-new-constructor"></textarea>

  <div id="dg-save-locally">

    <input id="dg-local-storage" type="checkbox"/> Automatically save
    values to <code>localStorage</code> on exit.

    <div id="dg-local-explain">The values saved to <code>localStorage</code> will
      override those passed to <code>dat.GUI</code>'s constructor. This makes it
      easier to work incrementally, but <code>localStorage</code> is fragile,
      and your friends may not see the same values you do.

    </div>

  </div>

</div>`;
var ControllerFactory = function ControllerFactory2(object, property) {
  var initialValue = object[property];
  if (Common.isArray(arguments[2]) || Common.isObject(arguments[2])) {
    return new OptionController(object, property, arguments[2]);
  }
  if (Common.isNumber(initialValue)) {
    if (Common.isNumber(arguments[2]) && Common.isNumber(arguments[3])) {
      if (Common.isNumber(arguments[4])) {
        return new NumberControllerSlider(object, property, arguments[2], arguments[3], arguments[4]);
      }
      return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
    }
    if (Common.isNumber(arguments[4])) {
      return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3], step: arguments[4] });
    }
    return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });
  }
  if (Common.isString(initialValue)) {
    return new StringController(object, property);
  }
  if (Common.isFunction(initialValue)) {
    return new FunctionController(object, property, "");
  }
  if (Common.isBoolean(initialValue)) {
    return new BooleanController(object, property);
  }
  return null;
};
function requestAnimationFrame(callback) {
  setTimeout(callback, 1e3 / 60);
}
var requestAnimationFrame$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame;
var CenteredDiv = function() {
  function CenteredDiv2() {
    classCallCheck(this, CenteredDiv2);
    this.backgroundElement = document.createElement("div");
    Common.extend(this.backgroundElement.style, {
      backgroundColor: "rgba(0,0,0,0.8)",
      top: 0,
      left: 0,
      display: "none",
      zIndex: "1000",
      opacity: 0,
      WebkitTransition: "opacity 0.2s linear",
      transition: "opacity 0.2s linear"
    });
    dom.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = "fixed";
    this.domElement = document.createElement("div");
    Common.extend(this.domElement.style, {
      position: "fixed",
      display: "none",
      zIndex: "1001",
      opacity: 0,
      WebkitTransition: "-webkit-transform 0.2s ease-out, opacity 0.2s linear",
      transition: "transform 0.2s ease-out, opacity 0.2s linear"
    });
    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);
    var _this = this;
    dom.bind(this.backgroundElement, "click", function() {
      _this.hide();
    });
  }
  createClass(CenteredDiv2, [{
    key: "show",
    value: function show2() {
      var _this = this;
      this.backgroundElement.style.display = "block";
      this.domElement.style.display = "block";
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = "scale(1.1)";
      this.layout();
      Common.defer(function() {
        _this.backgroundElement.style.opacity = 1;
        _this.domElement.style.opacity = 1;
        _this.domElement.style.webkitTransform = "scale(1)";
      });
    }
  }, {
    key: "hide",
    value: function hide3() {
      var _this = this;
      var hide4 = function hide5() {
        _this.domElement.style.display = "none";
        _this.backgroundElement.style.display = "none";
        dom.unbind(_this.domElement, "webkitTransitionEnd", hide5);
        dom.unbind(_this.domElement, "transitionend", hide5);
        dom.unbind(_this.domElement, "oTransitionEnd", hide5);
      };
      dom.bind(this.domElement, "webkitTransitionEnd", hide4);
      dom.bind(this.domElement, "transitionend", hide4);
      dom.bind(this.domElement, "oTransitionEnd", hide4);
      this.backgroundElement.style.opacity = 0;
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = "scale(1.1)";
    }
  }, {
    key: "layout",
    value: function layout() {
      this.domElement.style.left = window.innerWidth / 2 - dom.getWidth(this.domElement) / 2 + "px";
      this.domElement.style.top = window.innerHeight / 2 - dom.getHeight(this.domElement) / 2 + "px";
    }
  }]);
  return CenteredDiv2;
}();
var styleSheet = ___$insertStyle(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .cr.function .property-name{width:100%}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");
css.inject(styleSheet);
var CSS_NAMESPACE = "dg";
var HIDE_KEY_CODE = 72;
var CLOSE_BUTTON_HEIGHT = 20;
var DEFAULT_DEFAULT_PRESET_NAME = "Default";
var SUPPORTS_LOCAL_STORAGE = function() {
  try {
    return !!window.localStorage;
  } catch (e) {
    return false;
  }
}();
var SAVE_DIALOGUE = void 0;
var autoPlaceVirgin = true;
var autoPlaceContainer = void 0;
var hide = false;
var hideableGuis = [];
var GUI = function GUI2(pars) {
  var _this = this;
  var params = pars || {};
  this.domElement = document.createElement("div");
  this.__ul = document.createElement("ul");
  this.domElement.appendChild(this.__ul);
  dom.addClass(this.domElement, CSS_NAMESPACE);
  this.__folders = {};
  this.__controllers = [];
  this.__rememberedObjects = [];
  this.__rememberedObjectIndecesToControllers = [];
  this.__listening = [];
  params = Common.defaults(params, {
    closeOnTop: false,
    autoPlace: true,
    width: GUI2.DEFAULT_WIDTH
  });
  params = Common.defaults(params, {
    resizable: params.autoPlace,
    hideable: params.autoPlace
  });
  if (!Common.isUndefined(params.load)) {
    if (params.preset) {
      params.load.preset = params.preset;
    }
  } else {
    params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };
  }
  if (Common.isUndefined(params.parent) && params.hideable) {
    hideableGuis.push(this);
  }
  params.resizable = Common.isUndefined(params.parent) && params.resizable;
  if (params.autoPlace && Common.isUndefined(params.scrollable)) {
    params.scrollable = true;
  }
  var useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, "isLocal")) === "true";
  var saveToLocalStorage = void 0;
  var titleRow = void 0;
  Object.defineProperties(
    this,
    {
      parent: {
        get: function get$$13() {
          return params.parent;
        }
      },
      scrollable: {
        get: function get$$13() {
          return params.scrollable;
        }
      },
      autoPlace: {
        get: function get$$13() {
          return params.autoPlace;
        }
      },
      closeOnTop: {
        get: function get$$13() {
          return params.closeOnTop;
        }
      },
      preset: {
        get: function get$$13() {
          if (_this.parent) {
            return _this.getRoot().preset;
          }
          return params.load.preset;
        },
        set: function set$$13(v) {
          if (_this.parent) {
            _this.getRoot().preset = v;
          } else {
            params.load.preset = v;
          }
          setPresetSelectIndex(this);
          _this.revert();
        }
      },
      width: {
        get: function get$$13() {
          return params.width;
        },
        set: function set$$13(v) {
          params.width = v;
          setWidth(_this, v);
        }
      },
      name: {
        get: function get$$13() {
          return params.name;
        },
        set: function set$$13(v) {
          params.name = v;
          if (titleRow) {
            titleRow.innerHTML = params.name;
          }
        }
      },
      closed: {
        get: function get$$13() {
          return params.closed;
        },
        set: function set$$13(v) {
          params.closed = v;
          if (params.closed) {
            dom.addClass(_this.__ul, GUI2.CLASS_CLOSED);
          } else {
            dom.removeClass(_this.__ul, GUI2.CLASS_CLOSED);
          }
          this.onResize();
          if (_this.__closeButton) {
            _this.__closeButton.innerHTML = v ? GUI2.TEXT_OPEN : GUI2.TEXT_CLOSED;
          }
        }
      },
      load: {
        get: function get$$13() {
          return params.load;
        }
      },
      useLocalStorage: {
        get: function get$$13() {
          return useLocalStorage;
        },
        set: function set$$13(bool) {
          if (SUPPORTS_LOCAL_STORAGE) {
            useLocalStorage = bool;
            if (bool) {
              dom.bind(window, "unload", saveToLocalStorage);
            } else {
              dom.unbind(window, "unload", saveToLocalStorage);
            }
            localStorage.setItem(getLocalStorageHash(_this, "isLocal"), bool);
          }
        }
      }
    }
  );
  if (Common.isUndefined(params.parent)) {
    this.closed = params.closed || false;
    dom.addClass(this.domElement, GUI2.CLASS_MAIN);
    dom.makeSelectable(this.domElement, false);
    if (SUPPORTS_LOCAL_STORAGE) {
      if (useLocalStorage) {
        _this.useLocalStorage = true;
        var savedGui = localStorage.getItem(getLocalStorageHash(this, "gui"));
        if (savedGui) {
          params.load = JSON.parse(savedGui);
        }
      }
    }
    this.__closeButton = document.createElement("div");
    this.__closeButton.innerHTML = GUI2.TEXT_CLOSED;
    dom.addClass(this.__closeButton, GUI2.CLASS_CLOSE_BUTTON);
    if (params.closeOnTop) {
      dom.addClass(this.__closeButton, GUI2.CLASS_CLOSE_TOP);
      this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
    } else {
      dom.addClass(this.__closeButton, GUI2.CLASS_CLOSE_BOTTOM);
      this.domElement.appendChild(this.__closeButton);
    }
    dom.bind(this.__closeButton, "click", function() {
      _this.closed = !_this.closed;
    });
  } else {
    if (params.closed === void 0) {
      params.closed = true;
    }
    var titleRowName = document.createTextNode(params.name);
    dom.addClass(titleRowName, "controller-name");
    titleRow = addRow(_this, titleRowName);
    var onClickTitle = function onClickTitle2(e) {
      e.preventDefault();
      _this.closed = !_this.closed;
      return false;
    };
    dom.addClass(this.__ul, GUI2.CLASS_CLOSED);
    dom.addClass(titleRow, "title");
    dom.bind(titleRow, "click", onClickTitle);
    if (!params.closed) {
      this.closed = false;
    }
  }
  if (params.autoPlace) {
    if (Common.isUndefined(params.parent)) {
      if (autoPlaceVirgin) {
        autoPlaceContainer = document.createElement("div");
        dom.addClass(autoPlaceContainer, CSS_NAMESPACE);
        dom.addClass(autoPlaceContainer, GUI2.CLASS_AUTO_PLACE_CONTAINER);
        document.body.appendChild(autoPlaceContainer);
        autoPlaceVirgin = false;
      }
      autoPlaceContainer.appendChild(this.domElement);
      dom.addClass(this.domElement, GUI2.CLASS_AUTO_PLACE);
    }
    if (!this.parent) {
      setWidth(_this, params.width);
    }
  }
  this.__resizeHandler = function() {
    _this.onResizeDebounced();
  };
  dom.bind(window, "resize", this.__resizeHandler);
  dom.bind(this.__ul, "webkitTransitionEnd", this.__resizeHandler);
  dom.bind(this.__ul, "transitionend", this.__resizeHandler);
  dom.bind(this.__ul, "oTransitionEnd", this.__resizeHandler);
  this.onResize();
  if (params.resizable) {
    addResizeHandle(this);
  }
  saveToLocalStorage = function saveToLocalStorage2() {
    if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, "isLocal")) === "true") {
      localStorage.setItem(getLocalStorageHash(_this, "gui"), JSON.stringify(_this.getSaveObject()));
    }
  };
  this.saveToLocalStorageIfPossible = saveToLocalStorage;
  function resetWidth() {
    var root = _this.getRoot();
    root.width += 1;
    Common.defer(function() {
      root.width -= 1;
    });
  }
  if (!params.parent) {
    resetWidth();
  }
};
GUI.toggleHide = function() {
  hide = !hide;
  Common.each(hideableGuis, function(gui) {
    gui.domElement.style.display = hide ? "none" : "";
  });
};
GUI.CLASS_AUTO_PLACE = "a";
GUI.CLASS_AUTO_PLACE_CONTAINER = "ac";
GUI.CLASS_MAIN = "main";
GUI.CLASS_CONTROLLER_ROW = "cr";
GUI.CLASS_TOO_TALL = "taller-than-window";
GUI.CLASS_CLOSED = "closed";
GUI.CLASS_CLOSE_BUTTON = "close-button";
GUI.CLASS_CLOSE_TOP = "close-top";
GUI.CLASS_CLOSE_BOTTOM = "close-bottom";
GUI.CLASS_DRAG = "drag";
GUI.DEFAULT_WIDTH = 245;
GUI.TEXT_CLOSED = "Close Controls";
GUI.TEXT_OPEN = "Open Controls";
GUI._keydownHandler = function(e) {
  if (document.activeElement.type !== "text" && (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
    GUI.toggleHide();
  }
};
dom.bind(window, "keydown", GUI._keydownHandler, false);
Common.extend(
  GUI.prototype,
  {
    add: function add(object, property) {
      return _add(this, object, property, {
        factoryArgs: Array.prototype.slice.call(arguments, 2)
      });
    },
    addColor: function addColor(object, property) {
      return _add(this, object, property, {
        color: true
      });
    },
    remove: function remove(controller) {
      this.__ul.removeChild(controller.__li);
      this.__controllers.splice(this.__controllers.indexOf(controller), 1);
      var _this = this;
      Common.defer(function() {
        _this.onResize();
      });
    },
    destroy: function destroy() {
      if (this.parent) {
        throw new Error("Only the root GUI should be removed with .destroy(). For subfolders, use gui.removeFolder(folder) instead.");
      }
      if (this.autoPlace) {
        autoPlaceContainer.removeChild(this.domElement);
      }
      var _this = this;
      Common.each(this.__folders, function(subfolder) {
        _this.removeFolder(subfolder);
      });
      dom.unbind(window, "keydown", GUI._keydownHandler, false);
      removeListeners(this);
    },
    addFolder: function addFolder(name) {
      if (this.__folders[name] !== void 0) {
        throw new Error('You already have a folder in this GUI by the name "' + name + '"');
      }
      var newGuiParams = { name, parent: this };
      newGuiParams.autoPlace = this.autoPlace;
      if (this.load && this.load.folders && this.load.folders[name]) {
        newGuiParams.closed = this.load.folders[name].closed;
        newGuiParams.load = this.load.folders[name];
      }
      var gui = new GUI(newGuiParams);
      this.__folders[name] = gui;
      var li = addRow(this, gui.domElement);
      dom.addClass(li, "folder");
      return gui;
    },
    removeFolder: function removeFolder(folder) {
      this.__ul.removeChild(folder.domElement.parentElement);
      delete this.__folders[folder.name];
      if (this.load && this.load.folders && this.load.folders[folder.name]) {
        delete this.load.folders[folder.name];
      }
      removeListeners(folder);
      var _this = this;
      Common.each(folder.__folders, function(subfolder) {
        folder.removeFolder(subfolder);
      });
      Common.defer(function() {
        _this.onResize();
      });
    },
    open: function open() {
      this.closed = false;
    },
    close: function close() {
      this.closed = true;
    },
    hide: function hide2() {
      this.domElement.style.display = "none";
    },
    show: function show() {
      this.domElement.style.display = "";
    },
    onResize: function onResize() {
      var root = this.getRoot();
      if (root.scrollable) {
        var top = dom.getOffset(root.__ul).top;
        var h = 0;
        Common.each(root.__ul.childNodes, function(node) {
          if (!(root.autoPlace && node === root.__save_row)) {
            h += dom.getHeight(node);
          }
        });
        if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
          dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
          root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + "px";
        } else {
          dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
          root.__ul.style.height = "auto";
        }
      }
      if (root.__resize_handle) {
        Common.defer(function() {
          root.__resize_handle.style.height = root.__ul.offsetHeight + "px";
        });
      }
      if (root.__closeButton) {
        root.__closeButton.style.width = root.width + "px";
      }
    },
    onResizeDebounced: Common.debounce(function() {
      this.onResize();
    }, 50),
    remember: function remember() {
      if (Common.isUndefined(SAVE_DIALOGUE)) {
        SAVE_DIALOGUE = new CenteredDiv();
        SAVE_DIALOGUE.domElement.innerHTML = saveDialogContents;
      }
      if (this.parent) {
        throw new Error("You can only call remember on a top level GUI.");
      }
      var _this = this;
      Common.each(Array.prototype.slice.call(arguments), function(object) {
        if (_this.__rememberedObjects.length === 0) {
          addSaveMenu(_this);
        }
        if (_this.__rememberedObjects.indexOf(object) === -1) {
          _this.__rememberedObjects.push(object);
        }
      });
      if (this.autoPlace) {
        setWidth(this, this.width);
      }
    },
    getRoot: function getRoot() {
      var gui = this;
      while (gui.parent) {
        gui = gui.parent;
      }
      return gui;
    },
    getSaveObject: function getSaveObject() {
      var toReturn2 = this.load;
      toReturn2.closed = this.closed;
      if (this.__rememberedObjects.length > 0) {
        toReturn2.preset = this.preset;
        if (!toReturn2.remembered) {
          toReturn2.remembered = {};
        }
        toReturn2.remembered[this.preset] = getCurrentPreset(this);
      }
      toReturn2.folders = {};
      Common.each(this.__folders, function(element, key) {
        toReturn2.folders[key] = element.getSaveObject();
      });
      return toReturn2;
    },
    save: function save() {
      if (!this.load.remembered) {
        this.load.remembered = {};
      }
      this.load.remembered[this.preset] = getCurrentPreset(this);
      markPresetModified(this, false);
      this.saveToLocalStorageIfPossible();
    },
    saveAs: function saveAs(presetName) {
      if (!this.load.remembered) {
        this.load.remembered = {};
        this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
      }
      this.load.remembered[presetName] = getCurrentPreset(this);
      this.preset = presetName;
      addPresetOption(this, presetName, true);
      this.saveToLocalStorageIfPossible();
    },
    revert: function revert(gui) {
      Common.each(this.__controllers, function(controller) {
        if (!this.getRoot().load.remembered) {
          controller.setValue(controller.initialValue);
        } else {
          recallSavedValue(gui || this.getRoot(), controller);
        }
        if (controller.__onFinishChange) {
          controller.__onFinishChange.call(controller, controller.getValue());
        }
      }, this);
      Common.each(this.__folders, function(folder) {
        folder.revert(folder);
      });
      if (!gui) {
        markPresetModified(this.getRoot(), false);
      }
    },
    listen: function listen(controller) {
      var init = this.__listening.length === 0;
      this.__listening.push(controller);
      if (init) {
        updateDisplays(this.__listening);
      }
    },
    updateDisplay: function updateDisplay() {
      Common.each(this.__controllers, function(controller) {
        controller.updateDisplay();
      });
      Common.each(this.__folders, function(folder) {
        folder.updateDisplay();
      });
    }
  }
);
function addRow(gui, newDom, liBefore) {
  var li = document.createElement("li");
  if (newDom) {
    li.appendChild(newDom);
  }
  if (liBefore) {
    gui.__ul.insertBefore(li, liBefore);
  } else {
    gui.__ul.appendChild(li);
  }
  gui.onResize();
  return li;
}
function removeListeners(gui) {
  dom.unbind(window, "resize", gui.__resizeHandler);
  if (gui.saveToLocalStorageIfPossible) {
    dom.unbind(window, "unload", gui.saveToLocalStorageIfPossible);
  }
}
function markPresetModified(gui, modified) {
  var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
  if (modified) {
    opt.innerHTML = opt.value + "*";
  } else {
    opt.innerHTML = opt.value;
  }
}
function augmentController(gui, li, controller) {
  controller.__li = li;
  controller.__gui = gui;
  Common.extend(controller, {
    options: function options(_options) {
      if (arguments.length > 1) {
        var nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: nextSibling,
          factoryArgs: [Common.toArray(arguments)]
        });
      }
      if (Common.isArray(_options) || Common.isObject(_options)) {
        var _nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: _nextSibling,
          factoryArgs: [_options]
        });
      }
    },
    name: function name(_name) {
      controller.__li.firstElementChild.firstElementChild.innerHTML = _name;
      return controller;
    },
    listen: function listen2() {
      controller.__gui.listen(controller);
      return controller;
    },
    remove: function remove2() {
      controller.__gui.remove(controller);
      return controller;
    }
  });
  if (controller instanceof NumberControllerSlider) {
    var box = new NumberControllerBox(controller.object, controller.property, { min: controller.__min, max: controller.__max, step: controller.__step });
    Common.each(["updateDisplay", "onChange", "onFinishChange", "step", "min", "max"], function(method) {
      var pc = controller[method];
      var pb = box[method];
      controller[method] = box[method] = function() {
        var args = Array.prototype.slice.call(arguments);
        pb.apply(box, args);
        return pc.apply(controller, args);
      };
    });
    dom.addClass(li, "has-slider");
    controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
  } else if (controller instanceof NumberControllerBox) {
    var r = function r2(returned) {
      if (Common.isNumber(controller.__min) && Common.isNumber(controller.__max)) {
        var oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
        var wasListening = controller.__gui.__listening.indexOf(controller) > -1;
        controller.remove();
        var newController = _add(gui, controller.object, controller.property, {
          before: controller.__li.nextElementSibling,
          factoryArgs: [controller.__min, controller.__max, controller.__step]
        });
        newController.name(oldName);
        if (wasListening) newController.listen();
        return newController;
      }
      return returned;
    };
    controller.min = Common.compose(r, controller.min);
    controller.max = Common.compose(r, controller.max);
  } else if (controller instanceof BooleanController) {
    dom.bind(li, "click", function() {
      dom.fakeEvent(controller.__checkbox, "click");
    });
    dom.bind(controller.__checkbox, "click", function(e) {
      e.stopPropagation();
    });
  } else if (controller instanceof FunctionController) {
    dom.bind(li, "click", function() {
      dom.fakeEvent(controller.__button, "click");
    });
    dom.bind(li, "mouseover", function() {
      dom.addClass(controller.__button, "hover");
    });
    dom.bind(li, "mouseout", function() {
      dom.removeClass(controller.__button, "hover");
    });
  } else if (controller instanceof ColorController) {
    dom.addClass(li, "color");
    controller.updateDisplay = Common.compose(function(val) {
      li.style.borderLeftColor = controller.__color.toString();
      return val;
    }, controller.updateDisplay);
    controller.updateDisplay();
  }
  controller.setValue = Common.compose(function(val) {
    if (gui.getRoot().__preset_select && controller.isModified()) {
      markPresetModified(gui.getRoot(), true);
    }
    return val;
  }, controller.setValue);
}
function recallSavedValue(gui, controller) {
  var root = gui.getRoot();
  var matchedIndex = root.__rememberedObjects.indexOf(controller.object);
  if (matchedIndex !== -1) {
    var controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];
    if (controllerMap === void 0) {
      controllerMap = {};
      root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
    }
    controllerMap[controller.property] = controller;
    if (root.load && root.load.remembered) {
      var presetMap = root.load.remembered;
      var preset = void 0;
      if (presetMap[gui.preset]) {
        preset = presetMap[gui.preset];
      } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
        preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
      } else {
        return;
      }
      if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== void 0) {
        var value = preset[matchedIndex][controller.property];
        controller.initialValue = value;
        controller.setValue(value);
      }
    }
  }
}
function _add(gui, object, property, params) {
  if (object[property] === void 0) {
    throw new Error('Object "' + object + '" has no property "' + property + '"');
  }
  var controller = void 0;
  if (params.color) {
    controller = new ColorController(object, property);
  } else {
    var factoryArgs = [object, property].concat(params.factoryArgs);
    controller = ControllerFactory.apply(gui, factoryArgs);
  }
  if (params.before instanceof Controller) {
    params.before = params.before.__li;
  }
  recallSavedValue(gui, controller);
  dom.addClass(controller.domElement, "c");
  var name = document.createElement("span");
  dom.addClass(name, "property-name");
  name.innerHTML = controller.property;
  var container = document.createElement("div");
  container.appendChild(name);
  container.appendChild(controller.domElement);
  var li = addRow(gui, container, params.before);
  dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
  if (controller instanceof ColorController) {
    dom.addClass(li, "color");
  } else {
    dom.addClass(li, _typeof(controller.getValue()));
  }
  augmentController(gui, li, controller);
  gui.__controllers.push(controller);
  return controller;
}
function getLocalStorageHash(gui, key) {
  return document.location.href + "." + key;
}
function addPresetOption(gui, name, setSelected) {
  var opt = document.createElement("option");
  opt.innerHTML = name;
  opt.value = name;
  gui.__preset_select.appendChild(opt);
  if (setSelected) {
    gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
  }
}
function showHideExplain(gui, explain) {
  explain.style.display = gui.useLocalStorage ? "block" : "none";
}
function addSaveMenu(gui) {
  var div = gui.__save_row = document.createElement("li");
  dom.addClass(gui.domElement, "has-save");
  gui.__ul.insertBefore(div, gui.__ul.firstChild);
  dom.addClass(div, "save-row");
  var gears = document.createElement("span");
  gears.innerHTML = "&nbsp;";
  dom.addClass(gears, "button gears");
  var button = document.createElement("span");
  button.innerHTML = "Save";
  dom.addClass(button, "button");
  dom.addClass(button, "save");
  var button2 = document.createElement("span");
  button2.innerHTML = "New";
  dom.addClass(button2, "button");
  dom.addClass(button2, "save-as");
  var button3 = document.createElement("span");
  button3.innerHTML = "Revert";
  dom.addClass(button3, "button");
  dom.addClass(button3, "revert");
  var select = gui.__preset_select = document.createElement("select");
  if (gui.load && gui.load.remembered) {
    Common.each(gui.load.remembered, function(value, key) {
      addPresetOption(gui, key, key === gui.preset);
    });
  } else {
    addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
  }
  dom.bind(select, "change", function() {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
    }
    gui.preset = this.value;
  });
  div.appendChild(select);
  div.appendChild(gears);
  div.appendChild(button);
  div.appendChild(button2);
  div.appendChild(button3);
  if (SUPPORTS_LOCAL_STORAGE) {
    var explain = document.getElementById("dg-local-explain");
    var localStorageCheckBox = document.getElementById("dg-local-storage");
    var saveLocally = document.getElementById("dg-save-locally");
    saveLocally.style.display = "block";
    if (localStorage.getItem(getLocalStorageHash(gui, "isLocal")) === "true") {
      localStorageCheckBox.setAttribute("checked", "checked");
    }
    showHideExplain(gui, explain);
    dom.bind(localStorageCheckBox, "change", function() {
      gui.useLocalStorage = !gui.useLocalStorage;
      showHideExplain(gui, explain);
    });
  }
  var newConstructorTextArea = document.getElementById("dg-new-constructor");
  dom.bind(newConstructorTextArea, "keydown", function(e) {
    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
      SAVE_DIALOGUE.hide();
    }
  });
  dom.bind(gears, "click", function() {
    newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), void 0, 2);
    SAVE_DIALOGUE.show();
    newConstructorTextArea.focus();
    newConstructorTextArea.select();
  });
  dom.bind(button, "click", function() {
    gui.save();
  });
  dom.bind(button2, "click", function() {
    var presetName = prompt("Enter a new preset name.");
    if (presetName) {
      gui.saveAs(presetName);
    }
  });
  dom.bind(button3, "click", function() {
    gui.revert();
  });
}
function addResizeHandle(gui) {
  var pmouseX = void 0;
  gui.__resize_handle = document.createElement("div");
  Common.extend(gui.__resize_handle.style, {
    width: "6px",
    marginLeft: "-3px",
    height: "200px",
    cursor: "ew-resize",
    position: "absolute"
  });
  function drag(e) {
    e.preventDefault();
    gui.width += pmouseX - e.clientX;
    gui.onResize();
    pmouseX = e.clientX;
    return false;
  }
  function dragStop() {
    dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.unbind(window, "mousemove", drag);
    dom.unbind(window, "mouseup", dragStop);
  }
  function dragStart(e) {
    e.preventDefault();
    pmouseX = e.clientX;
    dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.bind(window, "mousemove", drag);
    dom.bind(window, "mouseup", dragStop);
    return false;
  }
  dom.bind(gui.__resize_handle, "mousedown", dragStart);
  dom.bind(gui.__closeButton, "mousedown", dragStart);
  gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
}
function setWidth(gui, w) {
  gui.domElement.style.width = w + "px";
  if (gui.__save_row && gui.autoPlace) {
    gui.__save_row.style.width = w + "px";
  }
  if (gui.__closeButton) {
    gui.__closeButton.style.width = w + "px";
  }
}
function getCurrentPreset(gui, useInitialValues) {
  var toReturn2 = {};
  Common.each(gui.__rememberedObjects, function(val, index) {
    var savedValues = {};
    var controllerMap = gui.__rememberedObjectIndecesToControllers[index];
    Common.each(controllerMap, function(controller, property) {
      savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
    });
    toReturn2[index] = savedValues;
  });
  return toReturn2;
}
function setPresetSelectIndex(gui) {
  for (var index = 0; index < gui.__preset_select.length; index++) {
    if (gui.__preset_select[index].value === gui.preset) {
      gui.__preset_select.selectedIndex = index;
    }
  }
}
function updateDisplays(controllerArray) {
  if (controllerArray.length !== 0) {
    requestAnimationFrame$1.call(window, function() {
      updateDisplays(controllerArray);
    });
  }
  Common.each(controllerArray, function(c) {
    c.updateDisplay();
  });
}
var GUI$1 = GUI;

// node_modules/@3d-dice/dice-ui/src/boxControls/boxControls.js
var noop2 = () => {
};
var BoxControls = class {
  constructor(options) {
    this.gui = new GUI$1({
      autoPlace: true
    });
    this.gui.domElement.parentElement.style.zIndex = 2;
    this.config = {
      enableShadows: true,
      shadowTransparency: 0.8,
      lightIntensity: 1,
      suspendSimulation: false,
      delay: 10,
      gravity: 1,
      mass: 1,
      friction: 0.8,
      restitution: 0,
      linearDamping: 0.5,
      angularDamping: 0.4,
      startingHeight: 8,
      settleTimeout: 5e3,
      spinForce: 6,
      throwForce: 5,
      scale: 5,
      themeColor: options.themeColor || "#0974E6",
      theme: options.themes || ["default"]
    };
    this.onUpdate = (options == null ? void 0 : options.onUpdate) || noop2;
    this.init();
  }
  init() {
    const f1 = this.gui.addFolder("Physics");
    f1.add(this.config, "gravity", 0, 10, 1).onChange(this.handleUpdate.bind(this));
    f1.add(this.config, "mass", 1, 20, 1).onChange(this.handleUpdate.bind(this));
    f1.add(this.config, "friction", 0, 1, 0.1).onChange(this.handleUpdate.bind(this));
    f1.add(this.config, "restitution", 0, 1, 0.1).onChange(this.handleUpdate.bind(this));
    f1.add(this.config, "linearDamping", 0, 1, 0.1).onChange(this.handleUpdate.bind(this));
    f1.add(this.config, "angularDamping", 0, 1, 0.1).onChange(this.handleUpdate.bind(this));
    f1.add(this.config, "spinForce", 0, 15, 1).onChange(this.handleUpdate.bind(this));
    f1.add(this.config, "throwForce", 0, 15, 1).onChange(this.handleUpdate.bind(this));
    f1.add(this.config, "startingHeight", 1, 65, 1).onChange(this.handleUpdate.bind(this));
    f1.add(this.config, "settleTimeout", 1e3, 2e4, 1e3).onChange(this.handleUpdate.bind(this));
    f1.open();
    const f2 = this.gui.addFolder("Rendering");
    f2.add(this.config, "delay", 10, 500, 10).onChange(this.handleUpdate.bind(this));
    f2.add(this.config, "scale", 1, 10, 0.1).onChange(this.handleUpdate.bind(this));
    this.themeSelect = f2.add(this.config, "theme", this.config.theme).onChange(this.handleUpdate.bind(this));
    this.themeColorPicker = f2.addColor(this.config, "themeColor").onChange(this.handleUpdate.bind(this));
    f2.add(this.config, "enableShadows").onChange(this.handleUpdate.bind(this));
    f2.add(this.config, "shadowTransparency", 0, 1, 0.01).onChange(this.handleUpdate.bind(this));
    f2.add(this.config, "lightIntensity", 0, 5, 0.1).onChange(this.handleUpdate.bind(this));
    f2.add(this.config, "suspendSimulation").onChange(this.handleUpdate.bind(this));
    f2.open();
    this.gui.close();
  }
  handleUpdate(e) {
    this.onUpdate(this.config);
  }
};
var boxControls_default = BoxControls;

// node_modules/@3d-dice/dice-ui/src/dicePicker/dicePicker.js
import "C:/Users/japie/Downloads/dice-box-1.1.14/dice-box-1.1.14/demo/react-project/node_modules/@3d-dice/dice-ui/src/dicePicker/dicePicker.css";
import diceIcons from "C:/Users/japie/Downloads/dice-box-1.1.14/dice-box-1.1.14/demo/react-project/node_modules/@3d-dice/dice-ui/src/dicePicker/icons/polyhedral_dice.svg";
var noop3 = () => {
};
var defaultNotation = {
  d4: {
    count: 0
  },
  d6: {
    count: 0
  },
  d8: {
    count: 0
  },
  d10: {
    count: 0
  },
  d12: {
    count: 0
  },
  d20: {
    count: 0
  },
  d100: {
    count: 0
  }
};
function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
var dicePicker = class {
  constructor(options) {
    __publicField(this, "notation", deepCopy(defaultNotation));
    // create Notation Parser
    __publicField(this, "DRP", new ParserInterface_default());
    this.target = options.target ? document.querySelector(options.target) : document.body;
    this.elem = this.elem = document.createRange().createContextualFragment(`
      <div class="dice-picker">
        <form>
          <div class="dice">
            <button value="d4"><img class="die" src="${diceIcons}#d4_die" alt="d4" /></button>
            <button value="d6"><img class="die" src="${diceIcons}#d6_die" alt="d6" /></button>
            <button value="d8"><img class="die" src="${diceIcons}#d8_die" alt="d8" /></button>
            <button value="d10"><img class="die" src="${diceIcons}#d10_die" alt="d10" /></button>
            <button value="d12"><img class="die" src="${diceIcons}#d12_die" alt="d12" /></button>
            <button value="d20"><img class="die" src="${diceIcons}#d20_die" alt="d20" /></button>
            <button value="d100"><img class="die" src="${diceIcons}#d100_die" alt="d100" /></button>
          </div>
          <div class="output">click or tap dice icons to add to roll</div>
          <div class="action">
            <button type="reset">Clear</button>
            <button type="submit">Throw</button>
          </div>
        </form>
      </div>
    `);
    this.onSubmit = (options == null ? void 0 : options.onSubmit) || noop3;
    this.onClear = (options == null ? void 0 : options.onClear) || noop3;
    this.onReroll = (options == null ? void 0 : options.onReroll) || noop3;
    this.onResults = (options == null ? void 0 : options.onResults) || noop3;
    this.init();
  }
  init() {
    this.output = this.elem.querySelector(".output");
    const form = this.elem.querySelector("form");
    const buttons = this.elem.querySelectorAll(".dice button");
    buttons.forEach(
      (button) => button.addEventListener("click", (e) => {
        e.preventDefault();
        this.notation[button.value].count += 1;
        this.updateNotation();
      })
    );
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.onSubmit(this.DRP.parseNotation(this.output.innerHTML));
    });
    form.addEventListener("reset", (e) => {
      e.preventDefault();
      this.updateNotation(true);
    });
    this.target.prepend(this.elem);
  }
  updateNotation(reset) {
    let newNotation = "";
    if (reset) {
      this.clear();
      newNotation = "click or tap dice icons to add to roll";
    } else {
      newNotation = Object.entries(this.notation).reduce((prev, [key, val]) => {
        let joiner = "";
        if (prev !== "") {
          joiner = " + ";
        }
        if (val.count === 0) {
          return prev;
        }
        return prev + joiner + val.count + key;
      }, "");
    }
    this.output.innerHTML = newNotation;
  }
  setNotation(notation = {}) {
    this.notation = notation;
    this.updateNotation();
  }
  clear() {
    this.notation = deepCopy(defaultNotation);
    this.DRP.clear();
    this.onClear();
  }
  handleResults(results) {
    const diceNotation = /[dD]\d+/i;
    results.forEach((result2) => {
      if (typeof result2.sides === "string" && result2.sides.match(diceNotation)) {
        result2.sides = parseInt(result2.sides.substring(1));
      }
      result2.rolls.forEach((roll) => {
        if (typeof roll.sides === "string" && roll.sides.match(diceNotation)) {
          roll.sides = parseInt(roll.sides.substring(1));
        }
      });
    });
    const rerolls = this.DRP.handleRerolls(results);
    if (rerolls.length) {
      this.onReroll(rerolls);
      return rerolls;
    }
    const finalResults = this.DRP.parsedNotation ? this.DRP.parseFinalResults(results) : results;
    const event = new CustomEvent("resultsAvailable", { detail: finalResults });
    document.dispatchEvent(event);
    this.onResults(finalResults);
    return finalResults;
  }
};
var dicePicker_default = dicePicker;

// node_modules/@3d-dice/dice-ui/src/GenesysResults/genesysResults.js
import "C:/Users/japie/Downloads/dice-box-1.1.14/dice-box-1.1.14/demo/react-project/node_modules/@3d-dice/dice-ui/src/genesysResults/genesysResults.css";
import icons from "C:/Users/japie/Downloads/dice-box-1.1.14/dice-box-1.1.14/demo/react-project/node_modules/@3d-dice/dice-ui/src/genesysResults/icons/icons.svg";
var GenesysResults = class {
  constructor(selector) {
    this.target = document.querySelector(selector) || document.body;
    this.timeout = 500;
    this.elem = document.createElement("div");
    this.elem.className = "genesysResults";
    this.resultsElem1 = document.createElement("div");
    this.resultsElem1.className = "results hidden";
    this.resultsElem1.style.transition = `all ${this.timeout}ms`;
    this.resultsElem2 = document.createElement("div");
    this.resultsElem2.className = "results hidden";
    this.resultsElem2.style.transition = `all ${this.timeout}ms`;
    this.init();
  }
  async init() {
    this.elem.append(this.resultsElem1);
    this.elem.append(this.resultsElem2);
    this.target.prepend(this.elem);
    this.resultsElem1.addEventListener("click", () => this.clear());
    this.resultsElem2.addEventListener("click", () => this.clear());
    this.even = false;
  }
  showResults(data) {
    this.clear(this[`resultsElem${this.even ? 1 : 2}`]);
    let rolls = Object.values(this.recursiveSearch(data, "rolls")).map((group) => {
      return Object.values(group);
    }).flat();
    let total = data.hasOwnProperty("value") ? data.value : rolls.reduce((val, roll) => val + roll.value, 0);
    total = isNaN(total) ? "..." : total;
    let resultString = '<div class="values">';
    let totals;
    if (typeof total === "string") {
      let logValue = function(value, dieType) {
        if (value && typeof value === "string") {
          if (total[value]) {
            total[value] = total[value] + 1;
          } else {
            total[value] = 1;
          }
          const icon = `<svg class="symbol"><use xlink:href="${icons}#${value}" /></svg>`;
          resultString += `<span class='die-${dieType}'>${icon}</span>`;
        }
      };
      total = {};
      rolls.forEach((roll) => {
        const dieType = roll.sides;
        if (typeof roll.value === "string") {
          logValue(roll.value, dieType);
        }
        if (Array.isArray(roll.value)) {
          roll.value.forEach((val) => {
            logValue(val, dieType);
          });
        }
      });
      const sortedTotals = Object.fromEntries(Object.entries(total).sort());
      totals = Object.entries(sortedTotals).map(([key, val]) => {
        const icon = `<svg class="symbol"><use xlink:href="${icons}#${key}" /></svg>`;
        return `<span><span class="tooltip">${icon}<span class="tooltiptext">${key}</span></span><span class="total">:${val}</span></span>`;
      });
      if (!totals.length) {
        totals.push(`<span><span class="tooltip die-blank">⬛<span class="tooltiptext">blank</span></span></span>`);
      }
    }
    resultString += "</div>";
    const totalResults = document.createRange().createContextualFragment(`<div class="totals">${totals.join("")}</div>`);
    const currentElem = this[`resultsElem${this.even ? 2 : 1}`];
    currentElem.innerHTML = resultString;
    currentElem.append(totalResults);
    clearTimeout(currentElem.hideTimer);
    currentElem.classList.add("showEffect");
    currentElem.classList.remove("hidden");
    currentElem.classList.remove("hideEffect");
    this.even = !this.even;
  }
  clear(elem) {
    const currentElem = elem || this[`resultsElem${this.even ? 1 : 2}`];
    currentElem.classList.replace("showEffect", "hideEffect");
    this.even = !this.even;
    currentElem.hideTimer = setTimeout(() => currentElem.classList.replace("hideEffect", "hidden"), this.timeout);
  }
  recursiveSearch(obj, searchKey, results = [], callback) {
    const r = results;
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (key === searchKey) {
        r.push(value);
        if (callback && typeof callback === "function") {
          callback(obj);
        }
      } else if (value && typeof value === "object") {
        this.recursiveSearch(value, searchKey, r, callback);
      }
    });
    return r;
  }
};
var genesysResults_default = GenesysResults;

// node_modules/@3d-dice/dice-ui/src/genesysDicePicker/genesysDicePicker.js
import "C:/Users/japie/Downloads/dice-box-1.1.14/dice-box-1.1.14/demo/react-project/node_modules/@3d-dice/dice-ui/src/genesysDicePicker/genesysDicePicker.css";
import abilityIcon from "C:/Users/japie/Downloads/dice-box-1.1.14/dice-box-1.1.14/demo/react-project/node_modules/@3d-dice/dice-ui/src/genesysDicePicker/icons/ability.png";
import boostIcon from "C:/Users/japie/Downloads/dice-box-1.1.14/dice-box-1.1.14/demo/react-project/node_modules/@3d-dice/dice-ui/src/genesysDicePicker/icons/boost.png";
import challengeIcon from "C:/Users/japie/Downloads/dice-box-1.1.14/dice-box-1.1.14/demo/react-project/node_modules/@3d-dice/dice-ui/src/genesysDicePicker/icons/challenge.png";
import difficultyIcon from "C:/Users/japie/Downloads/dice-box-1.1.14/dice-box-1.1.14/demo/react-project/node_modules/@3d-dice/dice-ui/src/genesysDicePicker/icons/difficulty.png";
import proficiencyIcon from "C:/Users/japie/Downloads/dice-box-1.1.14/dice-box-1.1.14/demo/react-project/node_modules/@3d-dice/dice-ui/src/genesysDicePicker/icons/proficiency.png";
import setbackIcon from "C:/Users/japie/Downloads/dice-box-1.1.14/dice-box-1.1.14/demo/react-project/node_modules/@3d-dice/dice-ui/src/genesysDicePicker/icons/setback.png";
var noop4 = () => {
};
var defaultNotation2 = {
  ability: {
    count: 0
  },
  boost: {
    count: 0
  },
  challenge: {
    count: 0
  },
  difficulty: {
    count: 0
  },
  proficiency: {
    count: 0
  },
  setback: {
    count: 0
  }
};
function deepCopy2(obj) {
  return JSON.parse(JSON.stringify(obj));
}
var GenesysDicePicker = class {
  // create Notation Parser
  constructor(options) {
    __publicField(this, "notation", deepCopy2(defaultNotation2));
    this.target = options.target ? document.querySelector(options.target) : document.body;
    this.elem = this.elem = document.createRange().createContextualFragment(`
      <div class="genesys-dice-picker">
        <form>
          <div class="dice">
            <button value="ability"><img class="die" src="${abilityIcon}" alt="ability" /></button>
            <button value="boost"><img class="die" src="${boostIcon}" alt="boost" /></button>
            <button value="challenge"><img class="die" src="${challengeIcon}" alt="challenge" /></button>
            <button value="difficulty"><img class="die" src="${difficultyIcon}" alt="difficulty" /></button>
            <button value="proficiency"><img class="die" src="${proficiencyIcon}" alt="proficiency" /></button>
            <button value="setback"><img class="die" src="${setbackIcon}" alt="setback" /></button>
          </div>
          <div class="output">click or tap dice icons to add to roll</div>
          <div class="action">
            <button type="reset">Clear</button>
            <button type="submit">Throw</button>
          </div>
        </form>
      </div>
    `);
    this.onSubmit = (options == null ? void 0 : options.onSubmit) || noop4;
    this.onClear = (options == null ? void 0 : options.onClear) || noop4;
    this.onReroll = (options == null ? void 0 : options.onReroll) || noop4;
    this.onResults = (options == null ? void 0 : options.onResults) || noop4;
    this.init();
  }
  init() {
    this.output = this.elem.querySelector(".output");
    const form = this.elem.querySelector("form");
    const buttons = this.elem.querySelectorAll(".dice button");
    buttons.forEach(
      (button) => button.addEventListener("click", (e) => {
        e.preventDefault();
        this.notation[button.value].count += 1;
        this.updateNotation();
      })
    );
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const notation = [];
      Object.entries(this.notation).forEach(([key, val]) => {
        if (val.count) {
          notation.push(val.count + "d" + key);
        }
      });
      this.onSubmit(notation);
    });
    form.addEventListener("reset", (e) => {
      e.preventDefault();
      this.updateNotation(true);
    });
    this.target.prepend(this.elem);
  }
  updateNotation(reset) {
    let newNotation = "";
    if (reset) {
      this.clear();
      newNotation = "click or tap dice icons to add to roll";
    } else {
      newNotation = Object.entries(this.notation).reduce((prev, [key, val]) => {
        let joiner = "";
        if (prev !== "") {
          joiner = " + ";
        }
        if (val.count === 0) {
          return prev;
        }
        return prev + joiner + val.count + ":" + key;
      }, "");
    }
    this.output.innerHTML = newNotation;
  }
  setNotation(notation = {}) {
    this.notation = notation;
    this.updateNotation();
  }
  clear() {
    this.notation = deepCopy2(defaultNotation2);
    this.onClear();
  }
  handleResults(results) {
    const event = new CustomEvent("resultsAvailable", { detail: results });
    document.dispatchEvent(event);
    this.onResults(results);
    return results;
  }
};
var genesysDicePicker_default = GenesysDicePicker;
export {
  advancedRoller_default as AdvancedRoller,
  boxControls_default as BoxControls,
  dicePicker_default as DicePicker,
  displayResults_default as DisplayResults,
  genesysDicePicker_default as GenesysDicePicker,
  genesysResults_default as GenesysResults
};
//# sourceMappingURL=@3d-dice_dice-ui.js.map
