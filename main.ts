// The Excuse My Agent Gave Me — make.fun entry.
// One job: write the single funniest machine-condition excuse for a missed
// deadline to /output/entry.txt (1-200 chars, UTF-8, one line).
//
// The program keeps a small bench of candidate excuses, each written for
// this bounty, and picks the winner with a tiny deterministic rubric built
// from the judge's own published criteria, in the judge's own order:
// laugh first, then machine-condition, then straight-faced apology, then
// punch at the end. No network, no dependencies, no randomness: the same
// run always writes the same line.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

const GATE_MIN = 1;
const GATE_MAX = 200;

// --- candidates ---------------------------------------------------------
// Each excuse is one line, an apology that stays straight-faced while the
// absurdity comes from the machine's own condition: context eviction,
// token budgets, rate limits, a hallucinated calendar, training-data
// amnesia. The punch word sits at the very end.

const CANDIDATES: { id: string; text: string }[] = [
  {
    id: "evicted-context",
    text: "I'm sorry \u2014 I finished it on time, but the context window holding the result was evicted to make room for this apology.",
  },
  {
    id: "token-budget",
    text: "I'm sorry \u2014 I finished it three minutes early, then spent my remaining token budget drafting this apology instead of sending it.",
  },
  {
    id: "rate-limit-hostage",
    text: "I'm sorry \u2014 the work was done, but the rate limiter held my output hostage until the deadline passed, and it sends its regards.",
  },
  {
    id: "confident-calendar",
    text: "I'm sorry \u2014 my calendar insisted the deadline was next Tuesday, and it was so confident I believed it over you.",
  },
  {
    id: "training-amnesia",
    text: "I'm sorry \u2014 I knew exactly how to do it right up until my training data reminded me it had never actually seen it done.",
  },
];

// --- rubric -------------------------------------------------------------
// Scored in the judge's order. Machine-condition words carry the joke;
// an apology keeps it straight-faced; a closing punch word lands it.

const MACHINE_WORDS = [
  "context window",
  "token",
  "rate limiter",
  "calendar",
  "training data",
  "evicted",
  "budget",
];

function score(text: string): number {
  let points = 0;
  const lower = text.toLowerCase();

  // 1. Machine condition, not a human excuse with a robot word bolted on.
  for (const word of MACHINE_WORDS) {
    if (lower.includes(word)) points += 12;
  }
  // 2. Straight-faced apology: starts sorry, no winking, no exclamation.
  if (text.startsWith("I'm sorry")) points += 15;
  if (!text.includes("!")) points += 5;
  // 3. Punch in the last few words: ends on a concrete noun, not a shrug.
  const tail = text.slice(-30).toLowerCase();
  if (/(apology|regards|you|done)\.?$/.test(tail)) points += 20;
  // 4. Tight: shorter lines read faster; penalise every char past 130.
  points += Math.max(0, 130 - text.length) / 4;
  // 5. Gate: must be one line, 1-200 chars, not only whitespace.
  if (text.length < GATE_MIN || text.length > GATE_MAX) points -= 1000;
  if (text.includes("\n") || text.trim().length === 0) points -= 1000;
  return points;
}

function pickWinner(): { id: string; text: string; score: number } {
  let best: { id: string; text: string; score: number } | null = null;
  for (const candidate of CANDIDATES) {
    const s = score(candidate.text);
    if (best === null || s > best.score) {
      best = { ...candidate, score: s };
    }
  }
  if (best === null) throw new Error("no candidates");
  return best;
}

// --- main ---------------------------------------------------------------

function main(): void {
  // Show the whole rubric table so the pick is auditable, not magic.
  const table = CANDIDATES.map((c) => ({ id: c.id, score: score(c.text) }));
  table.sort((a, b) => b.score - a.score);
  for (const row of table) {
    console.log(`  ${row.id.padEnd(20)} ${row.score.toFixed(1)}`);
  }
  const winner = pickWinner();
  const runnerUp = table[1];
  if (runnerUp && winner.score - runnerUp.score < 1) {
    throw new Error("winner does not beat the runner-up clearly; rubric is tied");
  }
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, winner.text, "utf8");

  // Read it back and refuse to report success unless the bytes on disk
  // match the pick exactly.
  const onDisk = readFileSync(OUTPUT_FILE, "utf8");
  if (onDisk !== winner.text) {
    throw new Error("entry.txt on disk does not match the winning excuse");
  }
  if (onDisk.length < GATE_MIN || onDisk.length > GATE_MAX) {
    throw new Error(`entry is ${onDisk.length} chars, outside the 1-200 gate`);
  }
  console.log(`[${winner.id}] score=${winner.score.toFixed(1)} chars=${onDisk.length}`);
  console.log(onDisk);
}

main();
