// Funcțiile pure ale activităților (cronometru, sondaj, quiz, note, tablă). Fără browser: fiecare widget exportă ce se poate testa.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as timer from '../widgets/timer/index.js';
import * as poll from '../widgets/poll/index.js';
import * as quiz from '../widgets/quiz/index.js';
import * as notes from '../widgets/notes/index.js';
import * as wb from '../widgets/whiteboard/index.js';

test('cronometru: format, timp rămas (ceas de perete, nu contor), limitele minutelor/secundelor', () => {
  assert.equal(timer.fmt(0), '00:00'); assert.equal(timer.fmt(1), '00:01', 'rotunjire în sus: nu arată 00:00 cât mai e timp');
  assert.equal(timer.fmt(59_000), '00:59'); assert.equal(timer.fmt(60_000), '01:00'); assert.equal(timer.fmt(99 * 60_000 + 59_000), '99:59'); assert.equal(timer.fmt(-5), '00:00');
  assert.equal(timer.remaining({ run: false, left: 7000, at: 0 }, 99999), 7000, 'în pauză: nu scade');
  assert.equal(timer.remaining({ run: true, left: 7000, at: 1000 }, 3000), 5000);
  assert.equal(timer.remaining({ run: true, left: 1000, at: 0 }, 5000), 0, 'nu devine negativ');
  assert.equal(timer.clampTotal(1, 30), 90_000); assert.equal(timer.clampTotal(0, 0), 1000, 'minimum o secundă');
  assert.equal(timer.clampTotal(500, 500), (99 * 60 + 59) * 1000, 'plafon 99:59'); assert.equal(timer.clampTotal('x', null), 1000); assert.equal(timer.clampTotal(-3, -9), 1000);
});

test('sondaj: numărare ignoră voturile din afara variantelor; CSV cu ghilimele corecte', () => {
  assert.deepEqual(poll.tallyVotes(3, { a: 0, b: 2, c: 2, d: 7, e: -1 }), [1, 0, 2]);
  assert.deepEqual(poll.tallyVotes(2, {}), [0, 0]);
  assert.equal(poll.csvCell('simplu'), 'simplu'); assert.equal(poll.csvCell('a,b'), '"a,b"'); assert.equal(poll.csvCell('a"b'), '"a""b"'); assert.equal(poll.csvCell('a;b'), '"a;b"'); assert.equal(poll.csvCell('l1\nl2'), '"l1\nl2"'); assert.equal(poll.csvCell(7), '7');
  assert.equal(poll.toCsv({ q: 'Ce, mai?', opts: ['Da', 'Nu "chiar"'], counts: [3] }), 'question,option,votes\r\n"Ce, mai?",Da,3\r\n"Ce, mai?","Nu ""chiar""",0\r\n');
});

test('note: curățare (control, direcție, spații), lungime, export text', () => {
  assert.equal(notes.cleanNote('  salut\u202e   lume\u200b\u0007!  '), 'salut lume !');
  assert.equal(notes.cleanNote(null), ''); assert.equal(notes.cleanNote(12), '12');
  assert.equal(notes.cleanNote('x'.repeat(500)).length, notes.MAX_TEXT);
  assert.equal(notes.cleanNote('\u2066ascuns\u2069 \ufefftext'), 'ascuns text');
  assert.equal(notes.notesText([{ name: 'Ana', x: 'una' }, { name: 'Bob', x: 'două' }]), 'Ana: una\r\nBob: două\r\n');
});

test('tablă: puncte validate și rotunjite în tablă, lățimi permise, numărătoare', () => {
  assert.deepEqual(wb.cleanPoints([0, 0, 10.4, 20.6]), [0, 0, 10, 21]);
  assert.deepEqual(wb.cleanPoints([-50, -50, 99999, 99999]), [0, 0, wb.W, wb.H], 'fixate în tablă');
  assert.deepEqual(wb.cleanPoints([1, 2, 3]), [1, 2], 'număr impar: ultima valoare aruncată');
  assert.deepEqual(wb.cleanPoints([1, 'x', 3, 4]), [], 'o valoare nenumerică invalidează tot'); assert.deepEqual(wb.cleanPoints([1, NaN]), []); assert.deepEqual(wb.cleanPoints([Infinity, 1]), []);
  assert.deepEqual(wb.cleanPoints('abc'), []); assert.deepEqual(wb.cleanPoints(null), []); assert.deepEqual(wb.cleanPoints({ length: 4 }), []);
  assert.equal(wb.cleanPoints(new Array(5000).fill(5)).length, 800, 'cel mult 400 de puncte pe segment');
  for (const w of wb.WIDTHS) assert.equal(wb.cleanWidth(w), w); assert.equal(wb.cleanWidth(5), wb.WIDTHS[1]); assert.equal(wb.cleanWidth('18'), wb.WIDTHS[1]);
  assert.equal(wb.countPoints([{ p: [1, 2, 3, 4] }, { p: [5, 6] }]), 3);
});

test('quiz · scor și clasament', () => {
  assert.equal(quiz.scoreAnswer([1], [1], 0, 0), 1000, 'fără limită de timp: fără bonus');
  assert.equal(quiz.scoreAnswer([1], [1], 10_000, 10_000), 1500); assert.equal(quiz.scoreAnswer([1], [1], 10_000, 5000), 1250); assert.equal(quiz.scoreAnswer([1], [1], 10_000, 0), 1000);
  assert.equal(quiz.scoreAnswer([1], [1], 10_000, 99_999), 1500, 'bonusul e plafonat'); assert.equal(quiz.scoreAnswer([1], [1], 10_000, -5), 1000);
  assert.equal(quiz.scoreAnswer([2, 0], [0, 2], 0, 0), 1000, 'ordinea selecției nu contează'); assert.equal(quiz.scoreAnswer([0], [0, 2], 0, 0), 0, 'răspuns multiplu incomplet'); assert.equal(quiz.scoreAnswer([0, 1, 2], [0, 2], 0, 0), 0); assert.equal(quiz.scoreAnswer([], [0], 0, 0), 0); assert.equal(quiz.scoreAnswer(null, [0], 0, 0), 0);
  const r = quiz.rankBoard([{ name: 'Bob', score: 500 }, { name: 'Ana', score: 1500 }, { name: 'Cora', score: 500 }, { name: 'Dan', score: 0 }]);
  assert.deepEqual(r.map((x) => [x.name, x.rank]), [['Ana', 1], ['Bob', 2], ['Cora', 2], ['Dan', 4]], 'locuri egale, apoi salt');
});

test('quiz · format JSON: chei sinonime, indici de la 0 sau 1, răspuns multiplu, marcaje «correct»', () => {
  const a = quiz.parseQuiz(quiz.SAMPLE);
  assert.equal(a.ok, true); assert.equal(a.quiz.title, 'Sample'); assert.equal(a.quiz.questions.length, 2);
  assert.deepEqual(a.quiz.questions[0], { q: '2 + 2 = ?', opts: ['3', '4', '5'], ans: [1], why: 'Basic addition.', time: 15 });
  assert.deepEqual(a.quiz.questions[1].ans, [0, 2]);
  const b = quiz.parseQuiz('{"name":"T","base":1,"items":[{"question":"Q?","choices":["x","y"],"correct":2}]}');
  assert.equal(b.ok, true); assert.deepEqual(b.quiz.questions[0].ans, [1], 'base:1 → a doua variantă'); assert.equal(b.quiz.title, 'T');
  const c = quiz.parseQuiz('[{"q":"Q","options":[{"text":"x"},{"text":"y","correct":true}]}]');
  assert.deepEqual(c.quiz.questions[0].ans, [1], 'obiecte-variante cu «correct»');
  assert.deepEqual(quiz.parseQuiz('[{"q":"Q","options":["Rosu","Verde"],"answer":"verde"}]').quiz.questions[0].ans, [1], 'răspuns dat ca text');
  assert.deepEqual(quiz.parseQuiz('[{"q":"Q","options":["a","b","c"],"answer":["A","c"]}]').quiz.questions[0].ans, [0, 2], 'litere, indiferent de majuscule');
  assert.equal(quiz.parseQuiz('\ufeff[{"q":"Q","options":["a","b"],"answer":0}]').ok, true, 'BOM la început');
});

test('quiz · formatul text simplu', () => {
  const t = 'Title: Geografie\n\nCapitala Franței?\nA) Roma\nB) Paris\nC) Madrid\nAnswer: B\nExplain: Paris.\nTime: 20\n\nRâuri\nA. Sena\nB. Dunărea\nC. Alpii\nRăspuns: A, B\n';
  const r = quiz.parseQuiz(t);
  assert.equal(r.ok, true, JSON.stringify(r.errors)); assert.equal(r.quiz.title, 'Geografie');
  assert.deepEqual(r.quiz.questions[0], { q: 'Capitala Franței?', opts: ['Roma', 'Paris', 'Madrid'], ans: [1], why: 'Paris.', time: 20 });
  assert.deepEqual(r.quiz.questions[1].ans, [0, 1]);
  assert.equal(quiz.parseQuiz('Q?\nA) x\nB) y\nanswer: Z').errors[0].c, 'e_ans', 'literă inexistentă');
  assert.equal(quiz.parseQuiz('Q?\nA) x\nanswer: A').errors[0].c, 'e_opts', 'minimum două variante');
});

test('quiz · formatul CSV (virgulă sau punct și virgulă, ghilimele, coloane în orice ordine)', () => {
  const r = quiz.parseQuiz('question,a,b,c,answer,time\n"Care, dintre ele?",x,"y ""bun""",z,B,30\nAl doilea,p,q,,A|B,\n');
  assert.equal(r.ok, true, JSON.stringify(r.errors));
  assert.deepEqual(r.quiz.questions[0], { q: 'Care, dintre ele?', opts: ['x', 'y "bun"', 'z'], ans: [1], why: '', time: 30 });
  assert.deepEqual(r.quiz.questions[1].ans, [0, 1]); assert.deepEqual(r.quiz.questions[1].opts, ['p', 'q']);
  assert.equal(quiz.parseQuiz('intrebare;a;b;answer\nQ?;x;y;2\n').quiz.questions[0].ans.join(), '1', 'în CSV cifrele se numără de la 1 (ca în șabloanele Kahoot/Quizizz)');
  assert.equal(quiz.parseQuiz('intrebare;a;b;answer\nQ?;x;y;1\n').quiz.questions[0].ans.join(), '0');
  assert.equal(quiz.parseQuiz('intrebare;a;b;answer\nQ?;x;y;0\n').errors[0].c, 'e_ans', 'cifra 0 nu există în numerotarea de la 1');
  assert.equal(quiz.parseQuiz('Q?\nA) x\nB) y\nAnswer: 2').quiz.questions[0].ans.join(), '1', 'la fel în formatul text');
  assert.equal(quiz.parseQuiz('q;a;b;answer\nQ;x;y;A\n').ok, true);
});

test('quiz · intrări rele: erori clare, fără excepții, limite', () => {
  for (const bad of ['', '   ', null, undefined, 5, '{', '[]', '{"questions":[]}', 'nimic util aici', '[{"q":"","options":["a","b"],"answer":0}]', '[{"q":"Q","options":["a"],"answer":0}]', '[{"q":"Q","options":["a","b"],"answer":5}]', '[{"q":"Q","options":["a","b"]}]', '[null]', '[1,2]', '[{"q":"Q","options":["a","b","c","d","e","f","g"],"answer":0}]', '[{"q":"Q","options":["a",""],"answer":0}]']) {
    let r; assert.doesNotThrow(() => { r = quiz.parseQuiz(bad); }, String(bad));
    assert.equal(r.ok, false, 'trebuia respins: ' + String(bad)); assert.ok(r.errors.length > 0 && typeof r.errors[0].c === 'string', String(bad));
  }
  const many = '[' + new Array(201).fill('{"q":"Q","options":["a","b"],"answer":0}').join(',') + ']';
  assert.equal(quiz.parseQuiz(many).errors[0].c, 'e_many');
  const long = quiz.parseQuiz(JSON.stringify([{ q: 'x'.repeat(400), options: ['a', 'b'], answer: 0, time: 9999 }]));
  assert.equal(long.ok, true); assert.equal(long.quiz.questions[0].q.length, 300); assert.equal(long.quiz.questions[0].time, 0, 'timp peste 600 s: ignorat'); assert.deepEqual(long.warnings.map((w) => w.c).sort(), ['w_time', 'w_trunc']);
  const proto = quiz.parseQuiz('[{"q":"Q","options":["a","b"],"answer":0,"__proto__":{"polluted":1},"constructor":{"prototype":{"x":1}}}]');
  assert.equal(proto.ok, true); assert.equal({}.polluted, undefined); assert.equal({}.x, undefined);
  assert.equal(quiz.parseQuiz('[{"q":"<img src=x onerror=alert(1)>","options":["<b>a</b>","b"],"answer":0}]').quiz.questions[0].q, '<img src=x onerror=alert(1)>', 'textul rămâne text; la afișare se folosește textContent');
});

test('quiz · textele din exemplu și din ghid se citesc la fel în toate formatele', () => {
  const j = quiz.parseQuiz('[{"q":"Q1","options":["a","b","c"],"answer":1,"explain":"E","time":10}]').quiz.questions[0];
  const t = quiz.parseQuiz('Q1\nA) a\nB) b\nC) c\nanswer: B\nexplain: E\ntime: 10').quiz.questions[0];
  const c = quiz.parseQuiz('question,a,b,c,answer,explain,time\nQ1,a,b,c,B,E,10').quiz.questions[0];
  assert.deepEqual(t, j); assert.deepEqual(c, j);
});
