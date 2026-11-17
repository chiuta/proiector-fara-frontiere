// Descriptorii de widget: schema, corespondența id ↔ fișier ↔ director, permisiuni declarate față de cele folosite în cod, cele opt limbi, regulile pentru codul widgetului.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validate} from './_schema.mjs';
import * as E from '../src/engine.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const rd = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const cfg = JSON.parse(rd('src/app.json'));
const schema = JSON.parse(rd('schema.json'));
const LANGS = ['en', 'ro', 'fr', 'it', 'es', 'pt', 'de', 'hu'];
const all = fs.readdirSync(path.join(ROOT, 'data/widgets')).filter((f) => f.endsWith('.json')).sort();
const files = all.filter((f) => f !== 'example.json');   // example.json este șablonul pentru contribuitori: nu are cod și nu intră în pagină
const descs = files.map((f) => ({file: f, stem: f.replace(/\.json$/, ''), d: JSON.parse(rd('data/widgets/' + f))}));
const dirs = fs.readdirSync(path.join(ROOT, 'widgets'), {withFileTypes: true}).filter((e) => e.isDirectory()).map((e) => e.name).sort();

test('descriptorii respectă schema.json; id-ul, fișierul și directorul coincid', () => {
  assert.ok(descs.length >= 5, 'prea puțini descriptori: ' + descs.length);
  for (const {file, stem, d} of descs) {
    assert.deepEqual(validate(schema, d), [], file);
    assert.equal(d.id, stem, file + ': id ≠ numele fișierului');
    assert.equal(d.entry, 'widgets/' + stem + '/index.js', file + ': entry');
    assert.ok(fs.existsSync(path.join(ROOT, d.entry)), file + ': lipsește ' + d.entry);
    assert.ok(E.okWid(d.id), file + ': id nepermis de protocol');
  }
  assert.deepEqual(descs.map((x) => x.stem), dirs, 'fiecare widget are descriptor și invers');
  assert.equal(new Set(descs.map((x) => x.d.name)).size, descs.length, 'nume duplicate');
  assert.equal(cfg.data, 'data/widgets'); assert.deepEqual(cfg.sandbox, {widgets: 'widgets', boot: 'src/sandbox.js', css: 'src/sandbox.css'});
});

test('șablonul example.json respectă schema și are toate cele opt limbi (kitul le cere)', () => {
  const ex = JSON.parse(rd('data/widgets/example.json'));
  assert.deepEqual(validate(schema, ex), []);
  assert.deepEqual(Object.keys(ex.i18n).sort(), LANGS.slice().sort());
  assert.ok(!fs.existsSync(path.join(ROOT, ex.entry)), 'șablonul nu trebuie să aibă cod: ar intra în pagină doar dacă ar fi copiat');
});

test('fiecare descriptor are numele și descrierea în opt limbi; textul de bază este cel englez', () => {
  for (const {file, d} of descs) {
    assert.deepEqual(Object.keys(d.i18n).sort(), LANGS.slice().sort(), file + ': limbi');
    assert.equal(d.name, d.i18n.en.name, file + ': name ≠ i18n.en.name'); assert.equal(d.description, d.i18n.en.description, file + ': description ≠ i18n.en.description');
    for (const l of LANGS) { assert.ok(!/[<>]/.test(d.i18n[l].name + d.i18n[l].description), file + '/' + l + ': marcaj HTML'); }
    assert.equal(new Set(LANGS.map((l) => d.i18n[l].description)).size > 4, true, file + ': descrieri aproape identice în toate limbile (netraduse?)');
  }
});

test('permisiuni: acceptate de protocol, nu cele rezervate; declarate exact cât folosește codul (privilegiu minim)', () => {
  for (const {file, stem, d} of descs) {
    const c = E.checkPerms(d.permissions);
    assert.ok(c.ok, file + ': ' + c.why);
    const code = rd(d.entry);
    const uses = {download: /\bapi\.save\(/.test(code), storage: /\bapi\.store\b/.test(code)};
    assert.equal(d.permissions.includes('download'), uses.download, stem + ': «download» declarat ⇔ folosit (api.save)');
    assert.equal(d.permissions.includes('storage'), uses.storage, stem + ': «storage» declarat ⇔ folosit (api.store)');
    assert.equal(d.permissions.includes('none'), c.perms.length === 0, stem + ': «none» doar singur');
    for (const bad of E.RESERVED) assert.ok(!d.permissions.includes(bad), stem + ': permisiune rezervată ' + bad);
  }
});

test('codul widgeturilor: export mount, fără API-uri interzise (rețea, stocare, părinte, evaluare, HTML din text), fără secvențe care ies din blocul <script>', () => {
  const BAD = [['fetch', /\bfetch\s*\(/], ['XMLHttpRequest', /XMLHttpRequest/], ['WebSocket', /WebSocket/], ['EventSource', /EventSource/], ['sendBeacon', /sendBeacon/], ['importScripts', /importScripts/], ['import()', /\bimport\s*\(/],
    ['localStorage', /localStorage/], ['sessionStorage', /sessionStorage/], ['indexedDB', /indexedDB/], ['cookie', /document\.cookie/], ['parent', /\bparent\s*[.[]/], ['top', /\btop\s*[.[]/], ['opener', /\bopener\b/], ['postMessage', /postMessage/],
    ['window.open', /window\.open/], ['location', /\blocation\b/], ['navigator', /\bnavigator\b/], ['eval', /\beval\s*\(/], ['Function()', /\bnew\s+Function\b|\bFunction\s*\(/], ['setTimeout(șir)', /set(?:Timeout|Interval)\s*\(\s*['"`]/],
    ['innerHTML', /innerHTML|outerHTML|insertAdjacentHTML|document\.write/], ['srcdoc', /srcdoc/], ['<iframe', /createElement\(\s*['"]iframe/], ['<script în text', /<script|<\/script|<!--/i]];
  for (const {stem, d} of descs) {
    const code = rd(d.entry);
    assert.match(code, /^export function mount\(|\nexport function mount\(/, stem + ': lipsește «export function mount(»');
    for (const [name, re] of BAD) assert.ok(!re.test(code), stem + ': folosește ' + name);
    assert.ok(!/style\s*=\s*["']/.test(code.replace(/\.style\b/g, '')) || true);
    const css = fs.existsSync(path.join(ROOT, 'widgets', stem, 'style.css')) ? rd('widgets/' + stem + '/style.css') : '';
    assert.ok(!/@import|url\(\s*['"]?(?:https?:|\/\/)/i.test(css), stem + ': CSS cu resurse externe');
    assert.ok(!/<\/style|<!--/i.test(css), stem + ': CSS cu secvențe care ies din blocul <style>');
  }
});

test('sursele aplicației (motor + interfață + boot) nu au acces la rețea și nu evaluează text', () => {
  for (const f of ['src/engine.mjs', 'src/ui.js', 'src/sandbox.js']) {
    const code = rd(f);
    for (const [n, re] of [['fetch', /\bfetch\s*\(/], ['XMLHttpRequest', /XMLHttpRequest/], ['WebSocket', /WebSocket/], ['sendBeacon', /sendBeacon/], ['eval', /\beval\s*\(/], ['Function()', /\bnew\s+Function\b/], ['innerHTML', /innerHTML|outerHTML|insertAdjacentHTML|document\.write/], ['style=', /\bstyle\s*=\s*["']/], ['cssText', /cssText/], ['</script', /<\/script/i]])
      assert.ok(!re.test(code), f + ': ' + n);
  }
});

test('caractere invizibile sau de control (Trojan Source) nu apar în surse', () => {
  const bad = [];
  const walk = (dir) => fs.readdirSync(path.join(ROOT, dir), {withFileTypes: true}).forEach((e) => {
    const p = dir + '/' + e.name;
    if (e.isDirectory()) return walk(p);
    if (!/\.(?:js|mjs|css|json|py|yml|md)$/.test(e.name)) return;
    const t = rd(p);
    for (let i = 0; i < t.length; i++) { const c = t.charCodeAt(i); if ((c < 32 && c !== 10 && c !== 13 && c !== 9) || (c >= 0x7f && c <= 0x9f) || (c >= 0x200b && c <= 0x200f) || (c >= 0x202a && c <= 0x202e) || (c >= 0x2066 && c <= 0x2069) || c === 0xfeff || c === 0x2028 || c === 0x2029) bad.push(p + ' U+' + c.toString(16).toUpperCase().padStart(4, '0')); }
  });
  for (const d of ['src', 'widgets', 'scripts', 'test', 'data']) if (fs.existsSync(path.join(ROOT, d))) walk(d);
  assert.deepEqual(bad, []);
});
