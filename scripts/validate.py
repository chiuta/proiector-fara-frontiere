#!/usr/bin/env python3
"""Validează descriptorii widgeturilor (data/widgets/*.json) față de schema.json și îi leagă de codul din widgets/.

Reguli în plus față de schemă:
  * id == numele fișierului; entry == widgets/<id>/index.js și fișierul există și exportă `mount`;
  * permisiunile «camera» și «microphone» sunt REZERVATE (neimplementate): un widget care le cere este respins;
  * pentru fiecare dintre cele 8 limbi ale aplicației lipsește o traducere → avertisment (cu --strict, eroare).
`example.json` este doar șablon pentru contribuitori: se verifică față de schemă, dar nu are cod în widgets/.
Folosire: python3 scripts/validate.py [director-date] [--strict]"""
import json, sys, pathlib
from jsonschema import Draft7Validator

LANGS = ["ro", "en", "fr", "de", "es", "it", "hu", "pt"]
RESERVED = {"camera", "microphone"}

args = [a for a in sys.argv[1:] if not a.startswith("--")]
strict = "--strict" in sys.argv[1:]
root = pathlib.Path(__file__).resolve().parent.parent
schema = json.loads((root / "schema.json").read_text(encoding="utf-8"))
data_dir = root / args[0] if args else root / "data"
validator = Draft7Validator(schema)
bad = warn = 0


def err(f, path, msg):
    global bad
    bad += 1
    print(f"{f.relative_to(root)}: {path}: {msg}")


def note(f, path, msg):
    global warn, bad
    if strict:
        bad += 1
    else:
        warn += 1
    print(f"{f.relative_to(root)}: {path}: {msg}" + ("" if strict else "  (avertisment)"))


files = sorted(data_dir.rglob("*.json"))
for f in files:
    try:
        doc = json.loads(f.read_text(encoding="utf-8"))
    except ValueError as e:
        err(f, "(root)", f"JSON invalid: {e}")
        continue
    for e in validator.iter_errors(doc):
        err(f, "/".join(map(str, e.absolute_path)) or "(root)", e.message)
    if not isinstance(doc, dict):
        continue
    for p in doc.get("permissions", []) if isinstance(doc.get("permissions"), list) else []:
        if p in RESERVED:
            err(f, "permissions", f"«{p}» este rezervată (neimplementată în această versiune); widgetul ar fi refuzat la deschidere")
    if f.name == "example.json":
        continue
    wid = doc.get("id")
    if wid != f.stem:
        err(f, "id", f"trebuie să fie egal cu numele fișierului ({f.stem})")
    entry = root / f"widgets/{f.stem}/index.js"
    if doc.get("entry") != f"widgets/{f.stem}/index.js":
        err(f, "entry", f"trebuie să fie widgets/{f.stem}/index.js")
    if not entry.is_file():
        err(f, "entry", "fișierul nu există")
    elif "export function mount(" not in entry.read_text(encoding="utf-8"):
        err(f, "entry", "widgetul trebuie să exporte «export function mount(container, api)»")
    have = doc.get("i18n", {}) if isinstance(doc.get("i18n"), dict) else {}
    for l in LANGS:
        if l not in have:
            note(f, f"i18n.{l}", "lipsește traducerea")
print(f"{len(files)} fișier(e) verificate, {bad} problemă(e), {warn} avertisment(e).")
sys.exit(1 if bad else 0)
