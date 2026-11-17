// Documentația face parte din contract: linkurile și căile duc undeva, limitele și API-ul descrise sunt cele din cod,
// exemplele rulează, formatul de quiz se citește așa cum e scris, iar cele opt limbi spun același lucru.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as E from '../src/engine.mjs';
import * as quiz from '../widgets/quiz/index.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rd = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(ROOT, p));
const LANGS = ['en', 'ro', 'fr', 'it', 'es', 'pt', 'de', 'hu'];
const sfx = (l) => (l === 'en' ? '' : '.' + l);
const app = JSON.parse(rd('src/app.json'));
const ids = fs.readdirSync(path.join(ROOT, 'data/widgets')).filter((f) => f.endsWith('.json') && f !== 'example.json').map((f) => f.slice(0, -5)).sort();
const mdFiles = fs.readdirSync(ROOT).filter((f) => f.endsWith('.md')).concat(fs.readdirSync(path.join(ROOT, 'docs')).filter((f) => f.endsWith('.md')).map((f) => 'docs/' + f));
const DOCS = ['widget-api', 'sandbox', 'protocol', 'quiz-format', 'quiz-format.ro', 'compat'];

// împarte un fișier markdown în secțiuni după titlurile «## » (în afara blocurilor de cod)
function sections(md) {
  const out = []; let cur = null, fence = false;
  md.split('\n').forEach((line) => {
    if (/^```/.test(line)) fence = !fence;
    if (!fence && /^## /.test(line)) { cur = {title: line.slice(3).trim(), lines: []}; out.push(cur); } else if (cur) cur.lines.push(line);
  });
  return out;
}
const bullets = (sec) => sec.lines.filter((l) => /^- /.test(l)).length;
const numbered = (sec) => sec.lines.filter((l) => /^\d+\. /.test(l)).length;
const noFences = (md) => md.replace(/```[\s\S]*?```/g, '');
const slug = (h) => h.toLowerCase().trim().replace(/`/g, '').replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, '').replace(/\s/g, '-');
const headingsOf = (md) => noFences(md).split('\n').filter((l) => /^#{1,6} /.test(l)).map((l) => slug(l.replace(/^#+\s+/, '')));
const blocksOf = (md, lang) => [...md.matchAll(new RegExp('```' + lang + '\\n([\\s\\S]*?)```', 'g'))].map((m) => m[1]);
const section = (md, title) => { const s = sections(md).find((x) => x.title === title); assert.ok(s, 'lipsește secțiunea «' + title + '»'); return s.lines.join('\n'); };

test('fiecare limbă are README, CONTRIBUTING, CHANGELOG, CODE_OF_CONDUCT și ISSUES_GOOD_FIRST; docs/ are cele șase documente; toate încep cu un titlu', () => {
  for (const l of LANGS) for (const base of ['README', 'CONTRIBUTING', 'CHANGELOG', 'CODE_OF_CONDUCT', 'ISSUES_GOOD_FIRST']) assert.ok(exists(base + sfx(l) + '.md'), 'lipsește ' + base + sfx(l) + '.md');
  for (const d of DOCS) assert.ok(exists('docs/' + d + '.md'), 'lipsește docs/' + d + '.md');
  for (const f of mdFiles) assert.match(rd(f), /^# \S/, f + ' trebuie să înceapă cu un titlu');
});

test('linkurile relative din toate fișierele .md duc la fișiere și la titluri care există', () => {
  const bad = [];
  for (const f of mdFiles) {
    const dir = path.dirname(f), text = noFences(rd(f));
    for (const m of text.matchAll(/!?\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const t = m[1];
      if (/^(https?:|mailto:)/.test(t)) continue;
      const [file, anchor] = t.split('#');
      const target = file ? path.posix.normalize(path.posix.join(dir === '.' ? '' : dir, file)) : f;
      if (!exists(target)) { bad.push(f + ' → ' + t + ' (fișier lipsă)'); continue; }
      if (anchor && target.endsWith('.md') && !headingsOf(rd(target)).includes(decodeURIComponent(anchor).toLowerCase())) bad.push(f + ' → ' + t + ' (titlu lipsă)');
    }
  }
  assert.deepEqual(bad, []);
});

test('căile din cod inline (src/, data/, docs/, test/, scripts/, widgets/, .github/) există; cele cu <id> sau * duc la fișiere de felul lor', () => {
  const resolves = (p) => {
    if (!/[<*{]/.test(p)) return exists(p);
    const cands = p.includes('<id>') ? ids.map((i) => p.replace(/<id>/g, i)) : [p];
    return cands.some((c) => {
      if (!c.includes('*')) return exists(c);
      const dir = path.posix.dirname(c), re = new RegExp('^' + path.posix.basename(c).replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
      return exists(dir) && fs.readdirSync(path.join(ROOT, dir)).some((x) => re.test(x));
    });
  };
  const bad = [];
  for (const f of mdFiles) {
    for (const m of noFences(rd(f)).matchAll(/`((?:src|data|docs|test|scripts|widgets|\.github)\/[^`\s]*)`/g)) if (!resolves(m[1])) bad.push(f + ': ' + m[1]);
  }
  assert.deepEqual(bad, []);
});

test('versiunea și data din README, CONTRIBUTING și CHANGELOG sunt cele din src/app.json', () => {
  for (const l of LANGS) {
    for (const base of ['README', 'CONTRIBUTING']) {
      const t = rd(base + sfx(l) + '.md');
      assert.ok(t.includes(app.version) && t.includes(app.updated), base + sfx(l) + '.md: versiunea sau data diferă de src/app.json');
    }
    assert.ok(rd('CHANGELOG' + sfx(l) + '.md').includes('[' + app.version + '] - ' + app.updated), 'CHANGELOG' + sfx(l) + '.md nu are intrarea ' + app.version + ' - ' + app.updated);
  }
  assert.equal(JSON.parse(rd('package.json')).version, app.version);
});

test('cele opt limbi au aceeași structură: secțiunile README, pașii, regulile, sarcinile și intrările din CHANGELOG', () => {
  const ref = {};
  for (const l of LANGS) {
    const secs = sections(rd('README' + sfx(l) + '.md'));
    const cnt = {sections: secs.length - (l === 'en' ? 1 : 0), does: bullets(secs[1]), how: bullets(secs[2]), limits: bullets(secs[3]), steps: numbered(secs[4])};
    const con = rd('CONTRIBUTING' + sfx(l) + '.md'), csecs = sections(con);
    cnt.conSteps = con.split('\n## ')[0].split('\n').filter((x) => /^\d+\. /.test(x)).length;
    cnt.conRules = bullets(csecs[0]);
    cnt.conAdd = numbered(csecs[csecs.length - 1]);
    cnt.issues = rd('ISSUES_GOOD_FIRST' + sfx(l) + '.md').split('\n').filter((x) => /^- \[ \] /.test(x)).length;
    const block = rd('CHANGELOG' + sfx(l) + '.md').split(/\n(?=## \[)/).find((b) => b.startsWith('## [' + app.version + ']'));
    assert.ok(block, 'CHANGELOG' + sfx(l) + '.md: lipsește blocul ' + app.version);
    cnt.changes = block.split('\n').filter((x) => /^- /.test(x)).length;
    if (l === 'en') {
      Object.assign(ref, cnt);
      assert.equal(secs[secs.length - 1].title, 'Contributors', 'doar README în engleză are secțiunea cu marcajele all-contributors');
      assert.equal(cnt.steps, 5); assert.equal(cnt.conSteps, 5); assert.equal(cnt.issues, 10); assert.equal(cnt.conAdd, 6);
      assert.ok(cnt.does >= 7 && cnt.how >= 5 && cnt.limits >= 6, 'secțiunile README sunt prea scurte');
    } else assert.deepEqual(cnt, ref, 'README/CONTRIBUTING/ISSUES/CHANGELOG (' + l + ') nu au aceeași structură ca versiunea în engleză');
  }
  const txt = rd('good-first-issues.txt').split('\n').filter(Boolean);
  assert.equal(txt.length, ref.issues, 'good-first-issues.txt are alt număr de sarcini decât ISSUES_GOOD_FIRST.md');
  const listed = rd('ISSUES_GOOD_FIRST.md').split('\n').filter((x) => /^- \[ \] /.test(x)).map((x) => x.slice(6));
  assert.deepEqual(txt, listed);
});

test('docs/protocol.md: tabelul de limite este cel din LIMITS, versiunea este PROTO, iar tipurile de mesaje și motivele «bye» există în cod', () => {
  const md = rd('docs/protocol.md'), L = E.LIMITS, ui = rd('src/ui.js');
  assert.match(md, new RegExp('^Version ' + E.PROTO + ' \\(`PROTO`', 'm'));
  const rows = [
    ['Phones at once', `${L.peers}`],
    ['Name length', `${L.name} characters`],
    ['Widget id length', `${L.wid} characters`],
    ['Shared state', `${L.state} characters of JSON`],
    ['Message without `drawing`', `${L.msg.none} characters, ${L.rate.none.rps} per second, bursts of ${L.rate.none.burst}`],
    ['Message with `drawing`', `${L.msg.drawing} characters, ${L.rate.drawing.rps} per second, bursts of ${L.rate.drawing.burst}`],
    ['Any message from one phone', `${L.phone.rps} per second, bursts of ${L.phone.burst}`],
    ['`name` and `rdy` from one phone', `${L.ctl.rps} per second, bursts of ${L.ctl.burst}`],
    ['Relayed between phones, in total', `${L.relay.rps} deliveries per second, bursts of ${L.relay.burst}`],
    ['Storage operations of one widget', `${L.store.rps} per second, bursts of ${L.store.burst}`],
    ['Send queue before non-vital messages are dropped', `${L.slow} bytes`],
    ['Messages kept for a widget that is still starting', `${L.queue}`],
    ['Shared state broadcast', `at most every ${L.stateEveryMs} ms`],
    ['Phone list broadcast', `at most every ${L.rosterEveryMs} ms`],
    ['Widget error notification', `at most every ${L.errEveryMs} ms`],
    ['File saved by a widget', `at most every ${L.saveEveryMs} ms; ${L.saveImage} bytes for an image, ${L.saveText} characters for text`]
  ];
  const table = md.split('\n').filter((x) => /^\| /.test(x)).slice(1);   // fără rândul de antet (separatorul «|---|» nu începe cu «| »)
  assert.deepEqual(table, rows.map(([k, v]) => '| ' + k + ' | ' + v + ' |'), 'tabelul din docs/protocol.md nu mai corespunde lui LIMITS');
  const typed = [...section(md, 'Messages').matchAll(/^- `([a-z]+)`/gm)].map((m) => m[1]);
  assert.deepEqual(typed, ['hi', 'name', 'rdy', 'w', 'hello', 'roster', 'open', 'ws', 'w', 'bye']);
  for (const t of new Set(typed)) assert.ok(ui.includes("'" + t + "'"), 'tipul de mesaj «' + t + '» nu mai apare în src/ui.js');
  for (const why of ['full', 'proto', 'removed', 'end']) { assert.ok(md.includes('`' + why + '`')); assert.ok(ui.includes("why: '" + why + "'"), 'motivul bye «' + why + '» nu mai există în cod'); }
});

test('în documente și README nu apar numere mari (≥ 4 cifre) care să nu fie limite din cod', () => {
  const known = new Set();
  (function walk(o) { Object.values(o).forEach((v) => (typeof v === 'object' ? walk(v) : typeof v === 'number' && known.add(v))); })(E.LIMITS);
  const quizSrc = rd('widgets/quiz/index.js');
  assert.match(quizSrc, /LIB_MAX = 5, LIB_TEXT = 12000;/); known.add(12000);
  assert.equal(quiz.scoreAnswer([0], [0], 10000, 0), 1000); known.add(1000);
  assert.equal(quiz.scoreAnswer([0], [0], 10000, 10000), 1500); known.add(1500);   // 1000 + cel mult 500 pentru viteză
  const bad = [];
  for (const f of mdFiles.filter((x) => /^(README|CONTRIBUTING)/.test(x) || x.startsWith('docs/'))) {
    for (const m of noFences(rd(f)).matchAll(/(?<![\w.-])(\d{4,})(?![\w-])/g)) {
      const n = +m[1];
      if (n >= 1900 && n <= 2100) continue;   // ani
      if (!known.has(n)) bad.push(f + ': ' + n);
    }
  }
  assert.deepEqual(bad, [], 'numere care nu sunt limite din LIMITS sau din codul quiz-ului');
});

test('docs/widget-api.md: membrii lui api și evenimentele descrise sunt exact cele din src/sandbox.js', () => {
  const src = rd('src/sandbox.js'), md = rd('docs/widget-api.md');
  // cheile de la primul nivel ale literalului «api = { … }», fără comentarii și șiruri
  function topKeys(s, from) {
    let i = s.indexOf('{', from), depth = 0, last = '{'; const keys = [];
    for (; i < s.length; i++) {
      const c = s[i];
      if (c === '/' && s[i + 1] === '*') { i = s.indexOf('*/', i + 2) + 1; continue; }
      if (c === '/' && s[i + 1] === '/') { i = s.indexOf('\n', i); continue; }
      if (c === '"' || c === "'" || c === '`') { for (i++; s[i] !== c; i++) if (s[i] === '\\') i++; last = 's'; continue; }
      if (c === '{' || c === '[' || c === '(') { depth++; last = c; continue; }
      if (c === '}' || c === ']' || c === ')') { depth--; if (depth === 0) break; last = c; continue; }
      if (/[A-Za-z_$]/.test(c)) {
        const id = /^[A-Za-z_$][\w$]*/.exec(s.slice(i))[0];
        if (depth === 1 && (last === '{' || last === ',') && /^\s*:/.test(s.slice(i + id.length))) keys.push(id);
        i += id.length - 1; last = 'i'; continue;
      }
      if (!/\s/.test(c)) last = c;
    }
    return keys;
  }
  const apiAt = src.indexOf('api = {');
  assert.ok(apiAt > 0, 'nu mai găsesc literalul api în src/sandbox.js');
  const inCode = topKeys(src, apiAt).sort();
  const part = section(md, 'The `api` object');
  const inDoc = [...new Set([...part.matchAll(/^- (.*?) — /gm)].flatMap((m) => [...m[1].matchAll(/`api\.([A-Za-z]+)/g)].map((x) => x[1])))].sort();
  assert.deepEqual(inDoc, inCode, 'membrii documentați diferă de cei din cod');
  // api.store.get / set / remove
  const storeAt = src.indexOf('store: {', apiAt);
  assert.deepEqual(topKeys(src, storeAt).sort(), ['get', 'remove', 'set']);
  for (const k of ['get', 'set', 'remove']) assert.ok(part.includes('`api.store.' + k + '('), 'api.store.' + k + ' nu este descris');
  // evenimentele: api.on(fn) și api.on('state' | 'join' | …, fn)
  const events = topKeys(src, src.indexOf('var L = {')).filter((k) => k !== 'message').sort();
  const docEvents = [...(/api\.on\(((?:'\w+'(?: \| )?)+), fn\)/.exec(part) || [, ''])[1].matchAll(/'(\w+)'/g)].map((m) => m[1]).sort();
  assert.deepEqual(docEvents, events, 'evenimentele documentate diferă de cele din cod');
  assert.ok(/`api\.on\(fn\)`/.test(part));
});

test('docs/widget-api.md: regulile din „Rules checked by npm test” sunt cele din test/data.test.mjs; exemplul respectă regulile constructorului', () => {
  const md = rd('docs/widget-api.md'), data = rd('test/data.test.mjs');
  const rules = section(md, 'Rules checked by `npm test`');
  const skip = new Set(['download', 'storage', 'camera', 'microphone', 'api.save', 'api.store', 'export function mount(', 'test/data.test.mjs']);
  const names = [...rules.matchAll(/`([^`]+)`/g)].map((m) => m[1]).filter((x) => !skip.has(x) && /^[A-Za-z.()]+$/.test(x));
  assert.ok(names.length >= 15);
  const alias = {'new Function': 'Function()', setTimeout: 'setTimeout(șir)'};   // numele din lista BAD a testului de date
  for (const n of names) assert.ok(data.includes("'" + (alias[n] || n) + "'"), '«' + n + '» este în documentație, dar nu în lista de interdicții din test/data.test.mjs');
  const example = blocksOf(md, 'js')[0];
  assert.ok(/export function mount\(container, api\)/.test(example));
  assert.ok(!/<!--|<script|<\/script/i.test(example), 'exemplul conține secvențe interzise');
  for (const l of example.split('\n').filter((x) => /^export /.test(x))) assert.match(l, /^export (function|const|let|var|class) /, 'export nepermis în exemplu: ' + l);
  for (const id of ids) for (const l of rd('widgets/' + id + '/index.js').split('\n').filter((x) => /^export /.test(x))) assert.match(l, /^export (function|const|let|var|class) /, id + ': export nepermis');
});

test('exemplul „Taps” din docs/widget-api.md rulează pe gazdă și pe telefon, cu un api făcut de mână', async () => {
  const code = blocksOf(rd('docs/widget-api.md'), 'js')[0];
  const mod = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
  assert.deepEqual(Object.keys(mod.strings.en).sort(), Object.keys(mod.strings.ro).sort(), 'en și ro trebuie să aibă aceleași chei');
  // un «DOM» minimal: elemente cu text, copii și ascultători
  function el(tag, props) {
    const e = {tag, props: props || {}, kids: [], text: props && props.text != null ? String(props.text) : '', appendChild(c) { this.kids.push(c); return c; }};
    Object.defineProperty(e, 'textContent', {get() { return this.text + this.kids.map((k) => k.textContent).join(''); }, set(v) { this.text = String(v); this.kids = []; }});
    return e;
  }
  const find = (e, tag) => (e.tag === tag ? e : e.kids.map((k) => find(k, tag)).find(Boolean));
  function makeApi(role, state) {
    const handlers = {message: [], state: [], lang: []}, sent = [], states = [];
    const api = {
      role, state: state || null, send: (d, o) => { sent.push([d, o]); return true; }, setState: (s) => { states.push(s); api.state = s; return true; },
      on: (a, b) => { if (typeof a === 'function') handlers.message.push(a); else (handlers[a] = handlers[a] || []).push(b); return () => {}; },
      h: (tag, props, kids) => { const e = el(tag, props); (kids || []).forEach((k) => e.appendChild(k)); return e; },
      t: (k, v) => String((mod.strings.en[k] != null ? mod.strings.en[k] : k)).replace(/\{(\w+)\}/g, (m, n) => (v && v[n] != null ? v[n] : m))
    };
    return {api, handlers, sent, states};
  }
  // gazda: numără atingerile, publică starea și ignoră mesajele nepotrivite
  const H = makeApi('host'), hc = el('div');
  mod.mount(hc, H.api);
  assert.match(hc.textContent, /0 taps so far/); assert.equal(find(hc, 'button'), undefined, 'gazda nu are buton');
  const onMsg = H.handlers.message[0];
  onMsg({k: 'tap'}, {id: 'p1', role: 'guest'}); onMsg({k: 'tap'}, {id: 'p2', role: 'guest'});
  for (const [d, f] of [[null, {id: 'p1'}], [{k: 'x'}, {id: 'p1'}], [{k: 'tap'}, null], [{k: 'tap'}, {}], ['tap', {id: 'p1'}]]) onMsg(d, f);
  assert.deepEqual(H.states, [{total: 1}, {total: 2}]); assert.match(hc.textContent, /2 taps so far/);
  assert.equal(H.handlers.lang.length, 1); H.handlers.lang[0](); assert.match(hc.textContent, /2 taps so far/);
  // telefonul: starea inițială, butonul trimite către gazdă, starea nouă se afișează, o stare greșită se ignoră
  const G = makeApi('guest', {total: 7}), gc = el('div');
  mod.mount(gc, G.api);
  assert.match(gc.textContent, /7 taps so far/);
  const btn = find(gc, 'button'); assert.ok(btn && btn.props.text === 'Tap!');
  btn.props.on.click(); assert.deepEqual(G.sent, [[{k: 'tap'}, {to: 'host'}]]);
  G.handlers.state[0]({total: 9}); assert.match(gc.textContent, /9 taps so far/);
  G.handlers.state[0]({total: 'x'}); G.handlers.state[0](null); assert.match(gc.textContent, /9 taps so far/);
});

test('docs/sandbox.md și descriptorii: permisiunile sunt cele din motor, cele rezervate sunt refuzate, iar fiecare descriptor are cele opt limbi', () => {
  const sb = rd('docs/sandbox.md');
  for (const p of E.PERMS) assert.ok(sb.includes('`' + p + '`'), 'docs/sandbox.md nu descrie permisiunea ' + p);
  for (const p of E.RESERVED) { assert.ok(sb.includes('`' + p + '`'), 'docs/sandbox.md nu pomenește ' + p); assert.equal(E.checkPerms([p]).ok, false); }
  assert.match(sb, /reserved/i);
  for (const id of ids) {
    const d = JSON.parse(rd('data/widgets/' + id + '.json'));
    for (const l of LANGS) assert.ok(d.i18n && d.i18n[l] && d.i18n[l].name && d.i18n[l].description, id + ': lipsește traducerea ' + l);
  }
  const ex = JSON.parse(rd('data/widgets/example.json'));
  for (const l of LANGS) assert.ok(ex.i18n[l] && ex.i18n[l].name && ex.i18n[l].description, 'example.json: lipsește traducerea ' + l);
});

test('docs/quiz-format.md și .ro.md: cele trei exemple (JSON, text, CSV) se citesc cu importatorul real și dau aceleași întrebări', () => {
  const per = {};
  for (const f of ['docs/quiz-format.md', 'docs/quiz-format.ro.md']) {
    const md = rd(f), got = {};
    for (const k of ['json', 'text', 'csv']) {
      const b = blocksOf(md, k); assert.equal(b.length, 1, f + ': trebuie să existe exact un bloc ```' + k);
      const r = quiz.parseQuiz(b[0]);
      assert.equal(r.ok, true, f + ' (' + k + '): ' + JSON.stringify(r.errors));
      assert.deepEqual(r.warnings, [], f + ' (' + k + '): exemplul nu trebuie să dea avertismente');
      got[k] = r.quiz;
    }
    assert.ok(got.json.questions.length >= 3);
    assert.deepEqual(got.text.questions, got.json.questions, f + ': exemplul text diferă de cel JSON');
    assert.deepEqual(got.csv.questions, got.json.questions, f + ': exemplul CSV diferă de cel JSON');
    assert.ok(got.json.title && got.text.title, f + ': JSON-ul și textul au titlu');
    per[f] = got.json.questions.map((q) => ({n: q.opts.length, ans: q.ans, time: q.time, multi: q.ans.length > 1}));
  }
  assert.deepEqual(per['docs/quiz-format.ro.md'], per['docs/quiz-format.md'], 'versiunea română trebuie să dea aceeași formă de întrebări');
  assert.ok(per['docs/quiz-format.md'].some((q) => q.multi) && per['docs/quiz-format.md'].some((q) => q.time > 0), 'exemplele arată și un răspuns multiplu, și un timp');
});

test('docs/quiz-format.md și .ro.md au aceeași structură, iar limitele, erorile și punctajul descrise sunt cele din cod', () => {
  const en = rd('docs/quiz-format.md'), ro = rd('docs/quiz-format.ro.md');
  const se = sections(en), sr = sections(ro);
  assert.equal(se.length, sr.length);
  se.forEach((s, i) => { assert.equal(bullets(s), bullets(sr[i]), 'secțiunea «' + s.title + '»: același număr de puncte'); assert.equal(numbered(s), numbered(sr[i])); });
  assert.deepEqual(en.match(/^```\w*/gm), ro.match(/^```\w*/gm), 'aceleași blocuri de cod, în aceeași ordine');
  assert.match(en, /\[Română\]\(quiz-format\.ro\.md\)/); assert.match(ro, /\[English\]\(quiz-format\.md\)/);
  assert.match(en, /Undava/); assert.match(ro, /Undava/);   // avertismentul că formatul Undava nu este verificat
  // coduri: fiecare cod din documente are text în widget, iar cele din limite chiar apar la citire
  const codes = ['e_empty', 'e_format', 'e_json', 'e_noq', 'e_many', 'e_qtext', 'e_opts', 'e_ans', 'w_trunc', 'w_time'];
  for (const c of codes) { assert.ok(en.includes('`' + c + '`') && ro.includes('`' + c + '`'), c + ' nu e în ambele documente'); for (const l of LANGS) assert.ok(quiz.strings[l][c], 'quiz.strings.' + l + '.' + c); }
  const json = (n, over) => JSON.stringify({questions: Array.from({length: n}, () => Object.assign({q: 'q', options: ['a', 'b'], answer: 0}, over || {}))});
  const code = (r) => r.errors.concat(r.warnings).map((x) => x.c);
  assert.equal(quiz.parseQuiz(json(200)).ok, true); assert.deepEqual(code(quiz.parseQuiz(json(201))), ['e_many']);
  const one = (over) => quiz.parseQuiz(JSON.stringify({questions: [Object.assign({q: 'q', options: ['a', 'b'], answer: 0}, over)]}));
  assert.equal(one({options: ['a', 'b', 'c', 'd', 'e', 'f']}).ok, true); assert.deepEqual(code(one({options: ['a']})), ['e_opts']); assert.deepEqual(code(one({options: ['a', 'b', 'c', 'd', 'e', 'f', 'g']})), ['e_opts']);
  assert.deepEqual(code(one({q: 'x'.repeat(300)})), []); assert.deepEqual(code(one({q: 'x'.repeat(301)})), ['w_trunc']);
  assert.deepEqual(code(one({options: ['x'.repeat(120), 'b']})), []); assert.deepEqual(code(one({options: ['x'.repeat(121), 'b']})), ['w_trunc']);
  assert.deepEqual(code(one({explain: 'x'.repeat(300)})), []); assert.deepEqual(code(one({explain: 'x'.repeat(301)})), ['w_trunc']);
  assert.equal(quiz.parseQuiz(JSON.stringify({title: 'x'.repeat(100), questions: [{q: 'q', options: ['a', 'b'], answer: 0}]})).quiz.title.length, 80);
  assert.deepEqual(code(one({time: 600})), []); assert.deepEqual(code(one({time: 601})), ['w_time']); assert.deepEqual(code(one({time: -1})), ['w_time']);
  assert.deepEqual(code(quiz.parseQuiz('')), ['e_empty']); assert.deepEqual(code(quiz.parseQuiz('hello')), ['e_format']); assert.deepEqual(code(quiz.parseQuiz('{')), ['e_json']);
  assert.equal(one({answer: 1}).quiz.questions[0].ans[0], 1, 'JSON: cifrele se numără de la 0'); assert.equal(quiz.parseQuiz(JSON.stringify({base: 1, questions: [{q: 'q', options: ['a', 'b'], answer: 1}]})).quiz.questions[0].ans[0], 0, '«base»: 1');
  assert.equal(quiz.parseQuiz('q?\nA) x\nB) y\nanswer: 1').quiz.questions[0].ans[0], 0, 'text: cifrele se numără de la 1');
  // punctaj și clasament
  assert.equal(quiz.scoreAnswer([1], [1], 20000, 10000), 1250); assert.equal(quiz.scoreAnswer([1], [1], 0, 0), 1000, 'fără timp: fără bonus'); assert.equal(quiz.scoreAnswer([0], [1], 20000, 20000), 0);
  assert.equal(quiz.scoreAnswer([0], [0, 2], 0, 0), 0, 'mulțimea trebuie să fie exactă'); assert.equal(quiz.scoreAnswer([2, 0], [0, 2], 0, 0), 1000);
  assert.deepEqual(quiz.rankBoard([{name: 'a', score: 3}, {name: 'b', score: 2}, {name: 'c', score: 2}, {name: 'd', score: 1}]).map((x) => x.rank), [1, 2, 2, 4]);
  assert.match(en, /512 KB/); assert.match(rd('widgets/quiz/index.js'), /512 \* 1024/);
});

test('docs/compat.md: nu fixează numere de teste, numește ce nu s-a încercat și are lista de verificare pentru dispozitive reale', () => {
  const md = rd('docs/compat.md');
  assert.doesNotMatch(md, /\b\d+\s+tests?\b/i, 'un număr de teste scris în text se învechește: nu-l pune');
  for (const t of ['What the page needs', 'The network', 'What has been tested', 'What has not been tested', 'Checklist for a test on real devices']) assert.ok(sections(md).some((s) => s.title === t), 'lipsește secțiunea «' + t + '»');
  assert.match(section(md, 'What has not been tested'), /real phone/i);
  assert.ok(numbered(sections(md).find((s) => s.title === 'Checklist for a test on real devices')) >= 5);
  assert.match(md, /ES2017/);
});
