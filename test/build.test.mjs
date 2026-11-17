// Pagina asamblată (index.html): corespunde surselor, blocurile inerte ale widgeturilor au hash-ul corect și sunt singurele scripturi noi permise de CSP.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/app.json'), 'utf8'));
const sha = (s) => createHash('sha256').update(s, 'utf8').digest('base64');
const csp = (html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]*)"/) || [])[1] || '';
const directive = (name) => { const m = csp.match(new RegExp('(?:^|;)\\s*' + name + '\\s+([^;]*)')); return m ? m[1].trim().split(/\s+/) : null; };
const widgets = fs.readdirSync(path.join(ROOT, 'widgets'), {withFileTypes: true}).filter((e) => e.isDirectory()).map((e) => e.name).sort();

test('node scripts/build.mjs --check: index.html corespunde cu src/', () => {
  const r = spawnSync(process.execPath, ['scripts/build.mjs', '--check'], {cwd: ROOT, encoding: 'utf8'});
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

test('fiecare widget este un bloc inert, cu hash corect, trecut în CSP; nimic altceva nu rulează în plus', () => {
  const blocks = [...html.matchAll(/<script type="text\/x-fff-sandbox" id="w-([a-z0-9-]+)" data-sha256="([^"]+)">([\s\S]*?)<\/script>/g)];
  assert.deepEqual(blocks.map((b) => b[1]).sort(), widgets, 'widgeturile din pagină ≠ directoarele widgets/');
  const scriptSrc = directive('script-src') || [];
  for (const [, id, h, text] of blocks) {
    assert.equal(sha(text), h, id + ': hash greșit (rulează node scripts/build.mjs)');
    assert.ok(scriptSrc.includes("'sha256-" + h + "'"), id + ': hash-ul lipsește din script-src (rulează kitul: build.mjs release … și apoi node scripts/build.mjs)');
    assert.ok(text.startsWith('"use strict";'), id + ': trebuie să înceapă cu "use strict";');
    assert.match(text, /PFS\.start\(\(function\(\)\{[\s\S]*return \{mount[\s\S]*\}\)\(\)\);\s*$/, id + ': structura blocului');
    assert.ok(!/<\/script/i.test(text) && !/<!--/.test(text), id + ': secvență care ar închide blocul');
    assert.ok(!/(?:^|[;}\n])\s*export\s+(?:function|const|var|let|class|default|async)\b/.test(text), id + ': «export» rămas în cod (builderul trebuie să-l elimine)');
  }
  const css = html.match(/<style id="w-css" media="not all" data-sha256="([^"]+)">([\s\S]*?)<\/style>/);
  assert.ok(css, 'lipsește <style id="w-css">'); assert.equal(sha(css[2]), css[1]); assert.ok((directive('style-src') || []).includes("'sha256-" + css[1] + "'"), 'hash-ul stilului lipsește din style-src');
  assert.ok(widgets.every((w) => css[2].includes('/* ' + w) || css[2].length > 500), 'CSS-ul de bază lipsește');
});

test('CSP: fără rețea, fără unsafe-inline/unsafe-eval; scripturile și stilurile doar pe hash', () => {
  assert.deepEqual(directive('default-src'), ["'none'"]);
  assert.equal(directive('connect-src'), null, 'pagina nu are voie să deschidă conexiuni (WebRTC se face prin kit, fără fetch)');
  for (const name of ['script-src', 'style-src']) {
    const toks = directive(name); assert.ok(toks && toks.length, name);
    for (const t of toks) assert.match(t, /^'sha256-[A-Za-z0-9+/]+={0,2}'$/, name + ': jeton nepermis ' + t);
  }
  assert.deepEqual(directive('base-uri'), ["'none'"]); assert.deepEqual(directive('form-action'), ["'none'"]);
  assert.ok(!/unsafe-|\*|https?:/.test(csp.replace(/manifest-src[^;]*|worker-src[^;]*/g, '')), 'CSP prea permisiv: ' + csp.slice(0, 200));
  assert.equal(directive('frame-src'), null, 'cadrele srcdoc moștenesc CSP-ul paginii; frame-src nu se declară');
});

test('marcajul paginii: fără style="" și fără atribute on*= (în afara scripturilor și stilurilor)', () => {
  const markup = html.replace(/<script\b[\s\S]*?<\/script>/g, '').replace(/<style\b[\s\S]*?<\/style>/g, '').replace(/<noscript\b[\s\S]*?<\/noscript>/g, '');   // <noscript> vine din ambalajul hubului și nu are efect cu CSP strict
  assert.ok(!/\sstyle\s*=/.test(markup), 'atribut style în marcaj');
  assert.ok(!/\son[a-z]+\s*=/i.test(markup), 'gestionar de eveniment în marcaj');
  assert.ok(!/<script[^>]+\ssrc=|<link[^>]+rel=["']?stylesheet|<iframe/i.test(markup), 'resursă externă sau cadru static');
});

test('versiunea din pagină, din src/app.json și din package.json coincide', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  assert.equal(pkg.version, cfg.version);
  assert.ok(html.includes('"' + cfg.version + '"') || html.includes(cfg.version), 'versiunea nu apare în pagină');
  assert.match(cfg.updated, /^\d{4}-\d{2}-\d{2}$/);
});
