# Quiz file format

**English** · [Română](quiz-format.ro.md)

The Quiz activity reads questions from a text you paste, type or load from a file (`.json`, `.txt` or `.csv`, up to 512 KB). It accepts three shapes and works out which one it has from the first characters: JSON when the text starts with `{` or `[`; the plain-text format when a line starts with `answer:`; CSV when the first line starts with `question`, `q` or `intrebare` followed by a comma or a semicolon. The **Check quiz** button lists every problem before anything starts.

> **Status of the "Undava" format.** The first plan for this project asked for compatibility with Undava quiz files. We looked for a public description or a sample of that format and found none, so this importer has **not** been checked against real Undava files. It reads three shapes that quiz tools commonly export. If your file does not load, attach an example (without personal data) to an issue and we will add it.

## The same quiz in the three shapes

JSON:

```json
{
  "title": "Maths and geography",
  "questions": [
    { "q": "What is 2 + 2?", "options": ["3", "4", "5"], "answer": 1, "time": 15, "explain": "Basic addition." },
    { "q": "Which of these are prime numbers?", "options": ["2", "9", "11", "15"], "answer": [0, 2] },
    { "q": "The capital of Romania is…", "options": ["Cluj-Napoca", "Bucharest", "Iași"], "answer": "B" }
  ]
}
```

Plain text (a blank line between questions; the first block may be `Title: …`):

```text
Title: Maths and geography

What is 2 + 2?
A) 3
B) 4
C) 5
answer: B
time: 15
explain: Basic addition.

Which of these are prime numbers?
A) 2
B) 9
C) 11
D) 15
answer: A C

The capital of Romania is…
A) Cluj-Napoca
B) Bucharest
C) Iași
answer: B
```

CSV (a header row; the delimiter is a comma or a semicolon, whichever the first line has more of):

```csv
question,a,b,c,d,answer,time,explain
What is 2 + 2?,3,4,5,,B,15,Basic addition.
Which of these are prime numbers?,2,9,11,15,A C,,
The capital of Romania is…,Cluj-Napoca,Bucharest,Iași,,B,,
```

`test/docs.test.mjs` reads these three examples with the real importer and requires that they give the same questions.

## JSON

The top level is a list of questions or an object that holds the list under `questions` (also accepted: `items`, `quiz`, `data`) and may have a `title` (or `name`).

- Question text: `q` (also `question`, `text`, `prompt`, `title`, `name`).
- Options: `options` (also `answers`, `choices`, `alternatives`, `variants`, `opts`): two to six strings, or objects with the text under `text` (also `label`, `answer`, `option`, `value`, `title`) and optionally `"correct": true` (also `isCorrect`, `right`) to mark the right ones.
- The right answer: `answer` (also `correct`, `correctAnswer`, `correct_answer`, `solution`, `right`, `ans`): a number, a letter `A`–`F`, a string of digits, the exact text of an option (case does not matter), or a list of these when several options are right. Instead of this field you can mark options as shown above.
- Numbers count from **0**. Put `"base": 1` (or `"indexBase": 1`) at the top level to count from 1.
- `time` (also `seconds`, `timeLimit`, `duration`): seconds from 0 to 600; 0 or absent means no timer. A value outside the range is ignored with a notice.
- `explain` (also `explanation`, `why`, `feedback`, `note`): a sentence shown with the answer.

## Plain text

Blocks are separated by blank lines. In a question block: the question on the first line (it may use several lines before the options), the options as `A) text`, `A. text` or `A: text` in order from A to F, then:

- `answer: B` — the right letters or digits, separated by spaces, commas, semicolons, `|` or `+` (`answer: A C`). Also `raspuns:` and `răspuns:`. **Digits count from 1** in this format.
- `explain: …` (also `why:`, `explicatie:`, `explicație:`) and `time: 15` (also `timp:`), both optional.
- A first block that has no options may be `Title: …` (also `titlu:`, `titre:`, `titel:`, `título:`, `titolo:`, `cím:`).

## CSV

The first row names the columns, in any order, in any case: `question` (also `q`, `intrebare`), the options `a` to `f` (also `option1` to `option6`), `answer`, and optionally `explain` and `time`. Cells with commas, semicolons or line breaks go in double quotes (`""` for a quote). In `answer`, letters or digits separated by spaces, `|` or `+`; **digits count from 1**, as in the text format.

## Limits and notices

- At most 200 questions; 2 to 6 options per question; a question text of at most 300 characters, an option of 120, an explanation of 300 and a title of 80. A longer text is cut and the notice `w_trunc` says which question. A file larger than 512 KB is refused. A quiz saved on the device (permission `storage`) may have at most 12000 characters, and the device keeps up to five.
- Errors (the quiz is not loaded): `e_empty` nothing to read; `e_format` unknown format; `e_json` invalid JSON; `e_noq` no questions found; `e_many` more than 200 questions; `e_qtext` a question without text; `e_opts` fewer than 2 or more than 6 options, or an empty option; `e_ans` the right answer is missing or does not match an option. The messages about one question name its number.
- Notices (the quiz loads): `w_trunc` a text was shortened; `w_time` a time limit outside 0–600 was ignored.

## How it runs

- Phones receive only the question and the options. The right answer stays on the projector until you press **Show answer**.
- A right answer is worth 1000 points. When the question has a time limit, up to 500 more are added in proportion to the time left. For a question with several right answers, the chosen set must be exactly the right set; a wrong or missing answer is 0.
- The scoreboard gives equal scores the same place (1, 2, 2, 4). You can hide the names on the scoreboard.
- **Save results** writes a CSV of names and scores through the browser's download; a name that could run as a spreadsheet formula gets an apostrophe in front.
