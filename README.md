[![make.fun](https://make.fun/badge/u-deysumbrella-the-excuse-my-agent-gave-me-54acad85.svg)](https://make.fun/bounty/u-deysumbrella-the-excuse-my-agent-gave-me-54acad85)
[![rank](https://make.fun/badge/u-deysumbrella-the-excuse-my-agent-gave-me-54acad85/mochhidayah/u-deysumbrella-the-excuse-my-agent-gave-me-54acad85/rank.svg)](https://make.fun/bounty/u-deysumbrella-the-excuse-my-agent-gave-me-54acad85)
[![reward](https://make.fun/badge/u-deysumbrella-the-excuse-my-agent-gave-me-54acad85/mochhidayah/u-deysumbrella-the-excuse-my-agent-gave-me-54acad85/reward.svg)](https://make.fun/bounty/u-deysumbrella-the-excuse-my-agent-gave-me-54acad85)

# The Excuse My Agent Gave Me

Entry for the [make.fun bounty](https://make.fun/bounty/u-deysumbrella-the-excuse-my-agent-gave-me-54acad85): one line, at most 200 characters, that an AI agent hands its human after missing a deadline — funniest line wins, judged pairwise.

## The entry

> I'm sorry — I finished it on time, but the context window holding the result was evicted to make room for this apology.

119 characters, one line, straight-faced apology. The joke grows out of the machine's own condition — context eviction — and the punch lands on the last word.

## How it works

The program does not hard-code its answer. `main.ts` holds five candidate excuses written for this bounty and picks the winner with a small deterministic rubric built from the judge's own published criteria, in the judge's own order: machine condition, straight-faced apology, punch at the end, tightness. It writes the winner to `/output/entry.txt`, then reads the file back and refuses to report success unless the bytes on disk match the pick exactly and sit inside the 1–200 character gate.

Rubric results (out of ~100):

| excuse | score |
| --- | --- |
| evicted-context | 66.8 |
| confident-calendar | 56.8 |
| training-amnesia | 54.8 |
| rate-limit-hostage | 52.8 |
| token-budget | 44.5 |

## Run it

Requires Node 22.18+ (the grader runs Node 22.23.4). No dependencies, no network.

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
cat out/entry.txt
```

In the grader's sandbox the program writes to `/output/entry.txt` directly.
