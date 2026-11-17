// Texte: aceleași chei și substituenți în toate cele opt limbi, fără texte goale; cheile din cod există și nu rămân chei nefolosite.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import I18N from '../src/i18n.mjs';
import * as E from '../src/engine.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const LANGS = ['en', 'ro', 'fr', 'it', 'es', 'pt', 'de', 'hu'];
const ph = (s) => [...String(s).matchAll(/\{(\d)\}/g)].map((m) => +m[1]).sort();
const keys = Object.keys(I18N.en);
const ui = read('src/ui.js');
const BUILDER = ['nav', 'title', 'open'];   // chei folosite de ambalajul generat (meniu, titlu, buton de deschidere), nu de ui.js

test('toate limbile au exact aceleași chei, aceiași substituenți {n}, fără texte goale și fără marcaj HTML', () => {
  assert.deepEqual(Object.keys(I18N).sort(), LANGS.slice().sort());
  assert.ok(keys.length >= 60, 'prea puține chei: ' + keys.length);
  for (const l of LANGS) {
    assert.deepEqual(Object.keys(I18N[l]), keys, l + ': chei diferite sau în altă ordine');
    for (const k of keys) {
      const v = I18N[l][k];
      assert.ok(typeof v === 'string' && v.trim().length > 0, l + '/' + k + ': text gol');
      assert.deepEqual(ph(v), ph(I18N.en[k]), l + '/' + k + ': substituenți diferiți');
      assert.ok(!/[<>]/.test(v), l + '/' + k + ': marcaj HTML în text (interfața folosește textContent)');
      assert.equal(v, v.trim(), l + '/' + k + ': spații la margini');
    }
  }
});

test('cheile folosite în ui.js există, iar cele definite sunt folosite', () => {
  const lit = [...ui.matchAll(/\bTf?\('([a-z0-9_]+)'(?=[,)])/g)].map((m) => m[1]);
  const prefixes = [...ui.matchAll(/\bT\('([a-z0-9_]+)' \+/g)].map((m) => m[1]);
  const family = [];
  for (const p of prefixes) { assert.equal(p, 'p_', 'familie de chei necunoscută: ' + p); for (const perm of E.PERMS) family.push(p + perm); }
  for (const k of lit.concat(family)) assert.ok(keys.includes(k), 'cheie folosită, dar nedefinită: ' + k);
  const mentioned = (k) => BUILDER.includes(k) || ui.includes("'" + k + "'") || prefixes.some((p) => k.startsWith(p));
  const unused = keys.filter((k) => !mentioned(k));
  assert.deepEqual(unused, [], 'chei definite și nefolosite');
});

test('fiecare motiv de închidere a sesiunii din protocol (bye.why) are un text în fiecare limbă', () => {
  const MSG = { full: 'err_full', proto: 'err_proto', removed: 'msg_removed', end: 'msg_end' };   // vezi gestionarea mesajului «bye» din ui.js
  for (const why of Object.keys(MSG)) for (const l of LANGS) assert.ok(I18N[l][MSG[why]], l + ': lipsește textul pentru «' + why + '»');
  assert.match(ui, /m\.why === 'full' \? Tf\('err_full'.*'proto' \? T\('err_proto'\).*'removed' \? T\('msg_removed'\) : T\('msg_end'\)/, 'maparea din ui.js s-a schimbat: actualizează testul');
});

test('textele widgeturilor (strings) au aceleași chei și substituenți în toate limbile', () => {
  for (const id of fs.readdirSync(path.join(ROOT, 'widgets'))) {
    const src = read('widgets/' + id + '/index.js');
    const m = src.match(/export const strings = (\{[\s\S]*?\n\});/);
    assert.ok(m, id + ': nu găsesc «export const strings»');
    const S = new Function('return ' + m[1])();
    const base = Object.keys(S.en);
    assert.deepEqual(Object.keys(S).sort(), LANGS.slice().sort(), id + ': limbi');
    for (const l of LANGS) {
      assert.deepEqual(Object.keys(S[l]).sort(), base.slice().sort(), id + '/' + l + ': chei diferite');
      for (const k of base) {
        assert.ok(typeof S[l][k] === 'string' && S[l][k].trim(), id + '/' + l + '/' + k + ': text gol');
        assert.deepEqual(ph(S[l][k]), ph(S.en[k]), id + '/' + l + '/' + k + ': substituenți');
        assert.ok(!/[<>]/.test(S[l][k]), id + '/' + l + '/' + k + ': marcaj HTML');
      }
    }
    const used = [...src.matchAll(/\bt\('([a-z0-9_]+)'/g)].map((x) => x[1]);
    for (const k of used) assert.ok(base.includes(k) || /^(?:locked|host|you|werr)$/.test(k), id + ': cheie folosită, dar nedefinită: ' + k);   // cele patru comune vin din boot (sandbox.js)
  }
});
