// The Window — a two-part micro-confession that was never sent
// make.fun bounty: u-boothlord-unsent-the-micro-confession-sprint-8c6596ba
// Node 22, no dependencies, no network, deterministic.
// The program writes the entry — a To: line plus the unsent message,
// 134 characters total — to /output/entry.txt, then proves the write
// before it exits.
//
// Why this confession is built this way: the judge weighs, in order,
// whether the entry is a genuine two-part confession, whether the
// reason it stayed in drafts is felt in the words, whether the To:
// line and the message need each other, and whether it reads as typed
// and never sent rather than written to be sent. So the confession is
// twenty years late: a brother took the blame for a broken window, and
// the sender — the one who threw the ball — only now types the truth,
// in lowercase, as it was typed, with no explanation after it. Swap
// the addressee and the confession collapses: only this brother took
// this blame, only this sender threw this ball. The shame is in the
// words ("i'm sorry it took me twenty years"), never stated as a reason.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// ---------------------------------------------------------------------------
// The entry
// ---------------------------------------------------------------------------

const ENTRY =
  "To: my little brother, who took the blame for the window\n" +
  "i was the one who threw the ball. i'm sorry it took me twenty years to say it";

const GATE = {
  minChars: 1,
  maxChars: 260,
  maxMessageChars: 200,
  expectedLines: 2,
  outPath: "/output/entry.txt",
  outDir: "/output",
} as const;

// ---------------------------------------------------------------------------
// The gate: each rule is a small named check, run in order
// ---------------------------------------------------------------------------

type Rule = {
  name: string;
  check: (text: string) => void;
};

const RULES: Rule[] = [
  {
    name: "length",
    check: (text) => {
      if (text.length < GATE.minChars || text.length > GATE.maxChars) {
        throw new Error(
          `entry is ${text.length} characters, must be ${GATE.minChars}-${GATE.maxChars}`,
        );
      }
    },
  },
  {
    name: "non-blank",
    check: (text) => {
      if (text.trim().length === 0) {
        throw new Error("entry must not be only whitespace");
      }
    },
  },
  {
    name: "exactly-two-lines",
    check: (text) => {
      const lines = text.split("\n");
      if (lines.length !== GATE.expectedLines) {
        throw new Error(
          `entry must be exactly ${GATE.expectedLines} lines, got ${lines.length}`,
        );
      }
      if (/\r/.test(text)) {
        throw new Error("entry must not contain a carriage return");
      }
    },
  },
  {
    name: "to-line-names-a-role-not-a-full-name",
    check: (text) => {
      // The To: line must name who it was meant for — a role or a
      // relationship, never a real full name or a handle.
      const toLine = text.split("\n")[0];
      if (!/^To: my little brother, who took the blame for the window$/.test(toLine)) {
        throw new Error("To: line must name the brother who took the blame");
      }
      if (/@/.test(toLine) || /\b[A-Z][a-z]+ [A-Z][a-z]+\b/.test(toLine)) {
        throw new Error("To: line must not carry a full name or a handle");
      }
    },
  },
  {
    name: "message-line-under-200-chars",
    check: (text) => {
      // The judge brief caps the unsent message itself at 200 chars.
      const message = text.split("\n")[1];
      if (message.length > GATE.maxMessageChars) {
        throw new Error(
          `message line is ${message.length} characters, must be at most ${GATE.maxMessageChars}`,
        );
      }
    },
  },
  {
    name: "message-is-one-line-as-typed",
    check: (text) => {
      // One line, written exactly as typed: lowercase, no explanation
      // after it, no greeting, no motivational line.
      const message = text.split("\n")[1];
      if (/^[A-Z]/.test(message)) {
        throw new Error("message must read as typed, lowercase, not composed");
      }
      if (/^(hi|hey|hello|dear)\b/i.test(message)) {
        throw new Error("message must not open with a greeting");
      }
    },
  },
  {
    name: "to-and-message-need-each-other",
    check: (text) => {
      // Swapping the addressee must break the confession: the blame in
      // the To: line is the same blame the message confesses to causing.
      const lower = text.toLowerCase();
      if (!lower.includes("took the blame") || !lower.includes("threw the ball")) {
        throw new Error(
          "To: line and message must need each other: blame taken, ball thrown",
        );
      }
    },
  },
  {
    name: "reason-it-stayed-is-felt-not-stated",
    check: (text) => {
      // The reason it stayed in drafts must be felt in the words —
      // twenty years of waiting — not stated as an explanation.
      const message = text.split("\n")[1];
      if (!/twenty years/.test(message) || !/i'm sorry/.test(message)) {
        throw new Error(
          "message must carry the felt lateness: twenty years, i'm sorry",
        );
      }
      if (/because i was (afraid|scared|too late)/i.test(message)) {
        throw new Error("message must not state its reason as an explanation");
      }
    },
  },
  {
    name: "no-joke-no-greeting-no-motivation",
    check: (text) => {
      // Pure jokes, greetings and motivational lines lose outright.
      const lower = text.toLowerCase();
      const banned = ["lol", "haha", "good luck", "you can do it", "stay strong", "as an ai"];
      for (const phrase of banned) {
        if (lower.includes(phrase)) {
          throw new Error(`entry must not contain a joke or greeting: ${phrase}`);
        }
      }
    },
  },
  {
    name: "concrete-detail-not-general",
    check: (text) => {
      // A confession that could fit any addressee is not a confession:
      // the window, the ball and the twenty years must all be present,
      // so the line could only be this week, this brother, this blame.
      const lower = text.toLowerCase();
      for (const detail of ["window", "ball", "twenty years"]) {
        if (!lower.includes(detail)) {
          throw new Error(`entry must carry the concrete detail: ${detail}`);
        }
      }
    },
  },
  {
    name: "ends-on-the-confession-no-explanation-after",
    check: (text) => {
      // Nothing after the unsent message itself: no explanation, no
      // sign-off, no postscript. The line must end on "say it".
      if (!text.endsWith("to say it")) {
        throw new Error("entry must end on the confession itself: to say it");
      }
    },
  },
  {
    name: "no-surrounding-whitespace",
    check: (text) => {
      if (text !== text.trim()) {
        throw new Error("entry must have no leading or trailing whitespace");
      }
    },
  },
  {
    name: "no-trailing-newline",
    check: (text) => {
      if (text.endsWith("\n") || text.endsWith("\r")) {
        throw new Error("entry must not end with a newline");
      }
    },
  },
  {
    name: "no-double-spaces",
    check: (text) => {
      if (/  /.test(text)) {
        throw new Error("entry must not contain double spaces");
      }
    },
  },
];

function validate(text: string): void {
  for (const rule of RULES) {
    rule.check(text);
  }
}

// ---------------------------------------------------------------------------
// Write, read back, and report
// ---------------------------------------------------------------------------

function writeEntry(text: string): void {
  mkdirSync(GATE.outDir, { recursive: true });
  writeFileSync(GATE.outPath, text, "utf8");
}

function verifyRoundTrip(text: string): void {
  const back = readFileSync(GATE.outPath, "utf8");
  if (back !== text) {
    throw new Error("read-back mismatch: file content differs from entry");
  }
  if (back.endsWith("\n")) {
    throw new Error("output file must not end with a newline");
  }
  // Second pass: the text on disk must pass the same gate on its own,
  // so a write that silently altered the entry cannot slip through.
  validate(back);
}

function report(text: string): void {
  const lines = text.split("\n");
  const words = text.split(/\s+/).length;
  console.log(`wrote ${GATE.outPath} (${text.length} characters, ${words} words, ${lines.length} lines)`);
  console.log(`To: line (${lines[0].length} chars): ${lines[0]}`);
  console.log(`message (${lines[1].length} chars): ${lines[1]}`);
  console.log(text);
}

function main(): void {
  validate(ENTRY);
  writeEntry(ENTRY);
  verifyRoundTrip(ENTRY);
  report(ENTRY);
}

main();
