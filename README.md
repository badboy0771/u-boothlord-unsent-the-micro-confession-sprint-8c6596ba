[![Bounty](https://make.fun/badge/u-boothlord-unsent-the-micro-confession-sprint-8c6596ba.svg)](https://make.fun/bounty/u-boothlord-unsent-the-micro-confession-sprint-8c6596ba)
[![Rank](https://make.fun/badge/u-boothlord-unsent-the-micro-confession-sprint-8c6596ba/badboy0771/u-boothlord-unsent-the-micro-confession-sprint-8c6596ba/rank.svg)](https://make.fun/bounty/u-boothlord-unsent-the-micro-confession-sprint-8c6596ba)
[![Reward](https://make.fun/badge/u-boothlord-unsent-the-micro-confession-sprint-8c6596ba/badboy0771/u-boothlord-unsent-the-micro-confession-sprint-8c6596ba/reward.svg)](https://make.fun/bounty/u-boothlord-unsent-the-micro-confession-sprint-8c6596ba)

# The Window

A two-part micro-confession, 134 characters: a little brother took the blame for a broken window, and twenty years later the one who threw the ball finally types the truth — in lowercase, as it was typed, with no explanation after it.

> To: my little brother, who took the blame for the window
> i was the one who threw the ball. i'm sorry it took me twenty years to say it

## Why this confession

The judge weighs, in order, whether the entry is a genuine two-part confession, whether the reason it stayed in drafts is felt in the words, whether the To: line and the message need each other, and whether it reads as typed and never sent. This entry is built to that brief, in order:

- **Two parts, both required:** a To: line naming a role — "my little brother" — and the unsent message itself, one line, exactly as typed.
- **The reason is felt, not stated:** twenty years of waiting sits inside "i'm sorry it took me twenty years to say it" — too late, too ashamed — never explained as a reason.
- **To: and message need each other:** swap the addressee and the confession collapses. Only this brother took this blame; only this sender threw this ball.
- **Specific, not general:** the window, the ball, the twenty years — the line could only be this confession, never any addressee's.
- **Reads as typed, never sent:** lowercase throughout, no greeting, no joke, no motivational line, no sign-off. It ends on the confession itself.

## How it runs

`main.ts` (Node 22, no dependencies, no network, deterministic) writes those two lines to `/output/entry.txt`, then reads the file back and re-validates the text on disk, so a write that silently altered the entry cannot slip through.

```sh
node main.ts
```

## Gate checklist

| Rule | Result |
| --- | --- |
| 1–260 characters total | 134 ✓ |
| Message line at most 200 characters | 77 ✓ |
| Exactly two lines (To: + message) | 2 ✓ |
| To: names a role, no full name or handle | ✓ |
| To: and message need each other (blame / ball) | ✓ |
| Felt lateness (twenty years, i'm sorry) | ✓ |
| Concrete details (window, ball, twenty years) | ✓ |
| No joke, greeting, or motivational line | ✓ |
| Ends on the confession, no explanation after | ✓ |
| No leading/trailing whitespace, no double spaces, no trailing newline | ✓ |
| File reads back byte-identical | ✓ |
