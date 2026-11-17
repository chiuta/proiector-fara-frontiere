// Logica pură a proiectorului: lista de participanți, limite, validări, rutarea mesajelor. Fără browser.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../src/engine.mjs';

test('Roster: culori distincte, nume curățat, limită de participanți', () => {
  const r = new E.Roster(3);
  const a = r.join('c1', '  Ana  '), b = r.join('c2', ''), c = r.join('c3', 'Cora');
  assert.deepEqual([a.peer.id, b.peer.id, c.peer.id], ['p1', 'p2', 'p3']);
  assert.equal(a.peer.name, 'Ana'); assert.equal(b.peer.name, 'P2');
  assert.equal(new Set([a.peer.color, b.peer.color, c.peer.color]).size, 3);
  assert.equal(r.join('c4', 'Dan'), null, 'sala plină');
  assert.equal(r.here().length, 3);
  assert.deepEqual(r.view().map((p) => Object.keys(p).sort()), [['color', 'id', 'locked', 'name'], ['color', 'id', 'locked', 'name'], ['color', 'id', 'locked', 'name']], 'vederea publică nu conține cid');
});

test('Roster: un telefon care revine cu același cid își recapătă locul (și când gazda nu a observat încă plecarea)', () => {
  const r = new E.Roster(5);
  const a = r.join('c1', 'Ana'); r.join('c2', 'Bob');
  r.leave(a.peer.id);
  assert.equal(r.here().length, 1);
  const back = r.join('c1', 'Ana M.');
  assert.equal(back.peer.id, a.peer.id); assert.equal(back.again, true); assert.equal(back.replaced, false); assert.equal(back.peer.name, 'Ana M.');
  const dup = r.join('c1', '');
  assert.equal(dup.peer.id, a.peer.id); assert.equal(dup.replaced, true, 'sesiunea veche trebuie închisă de apelant'); assert.equal(r.here().length, 2);
  assert.notEqual(r.join('', 'X').peer.id, a.peer.id, 'cid gol nu se potrivește cu nimeni');
});

test('Roster: blocare (per telefon și pentru toți; noii veniți moștenesc blocarea generală)', () => {
  const r = new E.Roster(5);
  const a = r.join('c1', 'A').peer;
  r.setLocked(a.id, true); assert.equal(r.find(a.id).locked, true);
  r.setLockAll(true); const b = r.join('c2', 'B').peer; assert.equal(b.locked, true);
  r.setLockAll(false); assert.equal(r.find(a.id).locked, false); assert.equal(r.join('c3', 'C').peer.locked, false);
  assert.equal(r.rename('nope', 'x'), null); r.rename(a.id, '  Alin  '); assert.equal(r.find(a.id).name, 'Alin'); r.rename(a.id, '   '); assert.equal(r.find(a.id).name, 'Alin', 'nume gol: neschimbat');
});

test('Roster: lista celor plecați este tăiată, dar cei prezenți rămân', () => {
  const r = new E.Roster(2);
  for (let i = 0; i < 40; i++) { const j = r.join('c' + i, 'N' + i); if (j) r.leave(j.peer.id); }
  const keep = r.join('keep', 'Keep');
  assert.ok(keep && keep.peer.here);
  assert.ok(r.all.length <= 2 * 3 + 1, 'lista nu crește nelimitat: ' + r.all.length);
});

test('Bucket: rafală, reumplere, niciodată negativ', () => {
  const b = new E.Bucket(10, 5, 0);
  let ok = 0; for (let i = 0; i < 20; i++) if (b.take(0)) ok++;
  assert.equal(ok, 5);
  assert.equal(b.take(50), false, '0,5 jetoane nu ajung');
  assert.equal(b.take(100), true, 'după 100 ms: 1 jeton');
  assert.equal(b.take(100), false);
  const T = 10_000_000;   // după o pauză lungă găleata se umple, dar nu peste rafală
  let n = 0; for (let i = 0; i < 20; i++) if (b.take(T)) n++;
  assert.equal(n, 5, 'plafonat la rafală');
  assert.equal(b.take(5), false, 'ceasul a mers înapoi: nu apar jetoane noi');
  assert.ok(b.tokens >= 0 && b.tokens < 1);
  assert.equal(b.take(5 + 100), true, 'după salt înapoi, ceasul nou funcționează normal (fără înfometare)');
});

test('cleanName: fără caractere de control/direcție, spații comprimate, limită pe puncte de cod', () => {
  assert.equal(E.cleanName('  Ana\u202e  Maria\u200b\u0007 '), 'Ana Maria');
  assert.equal(E.cleanName('', 'fb'), 'fb'); assert.equal(E.cleanName(null), ''); assert.equal(E.cleanName(42), '42');
  assert.equal(Array.from(E.cleanName('😀'.repeat(40))).length, E.LIMITS.name, 'emoji numărat pe puncte de cod, nu tăiat în două');
  assert.equal(E.cleanName('x'.repeat(100)).length, E.LIMITS.name);
  assert.equal(E.cleanName('\u2066ascuns\u2069'), 'ascuns');
});

test('permisiuni: acceptate, necunoscute, rezervate, «none» doar singur, duplicate', () => {
  assert.deepEqual(E.checkPerms(['none']), { ok: true, perms: [], why: '' });
  assert.deepEqual(E.checkPerms(['drawing', 'download', 'drawing']).perms, ['drawing', 'download']);
  assert.equal(E.checkPerms(['camera']).ok, false); assert.match(E.checkPerms(['microphone']).why, /^reserved:/);
  assert.match(E.checkPerms(['root']).why, /^unknown:/);
  assert.equal(E.checkPerms(['none', 'storage']).why, 'none-alone');
  assert.equal(E.checkPerms([]).ok, false); assert.equal(E.checkPerms(null).ok, false); assert.equal(E.checkPerms('none').ok, false);
  assert.equal(E.budgetFor([]).bytes, E.LIMITS.msg.none); assert.equal(E.budgetFor(['drawing']).bytes, E.LIMITS.msg.drawing);
  assert.ok(E.budgetFor(['drawing']).rate.rps > E.budgetFor(['storage']).rate.rps);
});

test('parseJson / chei / identificatori / culori', () => {
  assert.equal(E.parseJson('{"a":1}', 100).ok, true);
  assert.equal(E.parseJson('x'.repeat(101), 100).why, 'size'); assert.equal(E.parseJson('', 100).why, 'empty'); assert.equal(E.parseJson(5, 100).why, 'type'); assert.equal(E.parseJson('{', 100).why, 'json');
  for (const k of ['a', 'A.b-c_9', 'x'.repeat(40)]) assert.equal(E.okStoreKey(k), true, k);
  for (const k of ['', 'a b', '../x', 'x'.repeat(41), 5, 'ț']) assert.equal(E.okStoreKey(k), false, String(k));
  for (const w of ['timer', 'my-widget2']) assert.equal(E.okWid(w), true);
  for (const w of ['', 'Timer', 'a_b', 'a/b', 'x'.repeat(41), null]) assert.equal(E.okWid(w), false, String(w));
  assert.equal(E.okColor('#0072B2'), '#0072B2'); for (const c of ['red', '#fff', 'url(x)', '#12345g', null]) assert.equal(E.okColor(c), '');
});

test('salvare de fișiere: doar tipurile din lista albă, mărimi, nume fără cale, PNG strict', () => {
  const dl = ['download'];
  assert.equal(E.checkSave(['none'], { mime: 'text/csv', data: 'a', name: 'x' }).why, 'perm');
  assert.equal(E.checkSave(dl, { mime: 'text/html', data: '<b>', name: 'x' }).why, 'mime');
  assert.equal(E.checkSave(dl, { mime: 'application/x-msdownload', data: 'MZ', name: 'a.exe' }).why, 'mime');
  assert.equal(E.checkSave(dl, { mime: 'text/csv', data: 5, name: 'x' }).why, 'type');
  const c = E.checkSave(dl, { mime: 'text/csv', data: 'a,b', name: '../../etc/passwd' });
  assert.equal(c.ok, true); assert.equal(c.name, 'passwd.csv'); assert.equal(c.base64, false);
  assert.equal(E.checkSave(dl, { mime: 'text/plain', data: 'x'.repeat(E.LIMITS.saveText + 1), name: 'n' }).why, 'size');
  assert.equal(E.checkSave(dl, { mime: 'image/png', data: 'data:image/png;base64,iVBORw0KGgo=', name: 'a.png' }).base64, true);
  for (const bad of ['data:image/svg+xml;base64,AAAA', 'data:image/png;base64,@@@', 'javascript:alert(1)', 'iVBORw0KGgo=']) assert.equal(E.checkSave(dl, { mime: 'image/png', data: bad, name: 'a' }).why, 'data', bad);
  assert.equal(E.safeFileName('..\\..\\evil.exe', 'txt'), 'evil.txt'); assert.equal(E.safeFileName('', 'csv'), 'file.csv'); assert.equal(E.safeFileName('.hidden', 'png'), 'hidden.png');
  assert.equal(E.safeFileName('a'.repeat(200), 'txt').length, 56 + 4);
});

test('rutare: către gazdă, către toți ceilalți, către un telefon; ținte invalide sunt aruncate', () => {
  const here = ['p1', 'p2', 'p3'];
  assert.deepEqual(E.routeFromGuest('host', 'p1', here), { host: true, to: [] });
  assert.deepEqual(E.routeFromGuest('all', 'p1', here), { host: true, to: ['p2', 'p3'] });
  assert.deepEqual(E.routeFromGuest('p2', 'p1', here), { host: false, to: ['p2'] });
  for (const bad of ['p1', 'p9', '', 7, null, 'h']) assert.equal(E.routeFromGuest(bad, 'p1', here).drop, 'to', String(bad));
});

test('plic de mesaj: instanța trebuie să fie cea activă; mărimea depinde de permisiuni', () => {
  const act = { w: 'poll', n: 3 };
  assert.equal(E.checkEnvelope({ t: 'w', w: 'poll', n: 3, to: 'host', j: '{"k":1}' }, act, []).ok, true);
  assert.equal(E.checkEnvelope({ w: 'poll', n: 2, to: 'host', j: '{}' }, act, []).why, 'stale');
  assert.equal(E.checkEnvelope({ w: 'quiz', n: 3, to: 'host', j: '{}' }, act, []).why, 'stale');
  assert.equal(E.checkEnvelope({ w: 'poll', n: 3, to: 'host', j: '{}' }, null, []).why, 'stale');
  assert.equal(E.checkEnvelope({ w: 'poll', n: 3, to: 'x'.repeat(13), j: '{}' }, act, []).why, 'to');
  const big = '"' + 'x'.repeat(5000) + '"';
  assert.equal(E.checkEnvelope({ w: 'poll', n: 3, to: 'host', j: big }, act, []).why, 'size');
  assert.equal(E.checkEnvelope({ w: 'poll', n: 3, to: 'host', j: big }, act, ['drawing']).ok, true);
  assert.equal(E.checkEnvelope({ w: 'poll', n: 3, to: 'host', j: '{bad' }, act, []).why, 'json');
  assert.equal(E.checkEnvelope(null, act, []).ok, false);
});

test('limite: valori rezonabile și coerente', () => {
  const L = E.LIMITS;
  assert.ok(L.peers >= 10 && L.peers <= 60); assert.ok(L.state <= 65536 - 2000, 'starea încape într-un mesaj kit (64 KiB)');
  assert.ok(L.msg.drawing <= 65536 && L.storeVal <= L.storeTotal);
  assert.ok(L.relay.rps >= L.rate.drawing.rps, 'bugetul de retransmitere acoperă măcar un telefon care desenează');
  assert.ok(L.phone.rps >= L.rate.drawing.rps * 2 && L.phone.burst >= L.rate.drawing.burst, 'plafonul general al unui telefon nu trebuie atins de un telefon care desenează');
  assert.ok(L.ctl.rps >= 2 && L.ctl.burst >= 6, 'mesajele rare («name», «rdy») nu se pierd la schimbări rapide de activitate');
  assert.ok(L.stateEveryMs >= 50 && L.stateEveryMs <= 250 && L.rosterEveryMs >= 100 && L.rosterEveryMs <= 500, 'coalescarea nu trebuie să se simtă ca o întârziere');
  assert.ok(L.store.rps >= 5 && L.errEveryMs >= 1000);
  assert.equal(E.PROTO, 1); assert.deepEqual(E.RESERVED, ['camera', 'microphone']);
  assert.ok(E.COLORS.length >= L.peers / 3 && new Set(E.COLORS).size === E.COLORS.length);
});

test('CSV către foi de calcul: celulele-formulă sunt neutralizate, numerele și textul obișnuit rămân', () => {
  const N = E.csvNeutralize;
  assert.equal(N('a,b\r\n1,2\r\n'), 'a,b\r\n1,2\r\n', 'CSV obișnuit: neschimbat');
  assert.equal(N('=HYPERLINK("x")'), '\'=HYPERLINK("x")');
  assert.equal(N('1,=1+1,+SUM(A1),-2+3,@x'), "1,'=1+1,'+SUM(A1),'-2+3,'@x");
  assert.equal(N('"=1+1",ok'), '"\'=1+1",ok', 'celulă între ghilimele: apostroful intră după ghilimeaua de deschidere');
  assert.equal(N('"a ""q"" b",\'=x'), '"a ""q"" b",\'=x', 'ghilimele duble în celulă și celulă deja neutralizată (idempotență)');
  assert.equal(N(N('=a,+b,"@c"')), N('=a,+b,"@c"'), 'idempotentă');
  assert.equal(N('-5,+3,2,-1.5,+1e-3,0'), '-5,+3,2,-1.5,+1e-3,0', 'numere obișnuite, inclusiv negative, rămân neatinse');
  assert.equal(N('x;=1;y'), "x;'=1;y", 'delimitator «;» (foi de calcul în limbi cu virgulă zecimală)');
  assert.equal(N('a\t=1'), "a\t'=1", 'delimitator tab');
  assert.equal(N('"linie1\n=2",z'), '"linie1\n=2",z', 'o celulă între ghilimele cu rând nou: doar începutul celulei contează');
  assert.equal(N('"\t=1"'), '"\'\t=1"', 'tab la începutul unei celule între ghilimele');
  assert.equal(N(''), ''); assert.equal(N('\r\n'), '\r\n'); assert.equal(N(',,'), ',,');
  assert.equal(N('"a"b,=c'), '"a"b,\'=c', 'CSV malformat (text după ghilimele): nu se blochează');
  // prin checkSave: se aplică doar fișierelor CSV
  const dl = ['download'];
  assert.equal(E.checkSave(dl, { mime: 'text/csv', data: 'rank,name\r\n1,"=cmd|\' /C calc\'!A0"\r\n', name: 'r' }).data, 'rank,name\r\n1,"\'=cmd|\' /C calc\'!A0"\r\n');
  assert.equal(E.checkSave(dl, { mime: 'text/plain', data: '=1+1', name: 'r' }).data, '=1+1', 'textul simplu nu e foaie de calcul');
});
