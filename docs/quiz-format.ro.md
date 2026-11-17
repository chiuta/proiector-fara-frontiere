# Formatul fișierului de quiz

[English](quiz-format.md) · **Română**

Activitatea Quiz citește întrebările dintr-un text pe care îl lipești, îl scrii sau îl încarci dintr-un fișier (`.json`, `.txt` sau `.csv`, până la 512 KB). Acceptă trei forme și își dă seama singură pe care o ai, după primele caractere: JSON când textul începe cu `{` sau `[`; formatul text simplu când o linie începe cu `answer:` (sau `răspuns:`); CSV când prima linie începe cu `question`, `q` sau `intrebare`, urmat de virgulă sau punct și virgulă. Butonul **Verifică quiz-ul** arată toate problemele înainte să pornească ceva.

> **Starea formatului „Undava”.** Planul inițial al proiectului cerea compatibilitate cu fișierele de quiz Undava. Am căutat o descriere publică sau un exemplu al acelui format și nu am găsit niciuna, așa că importatorul **nu** a fost verificat cu fișiere Undava reale. El citește trei forme pe care instrumentele de quiz le exportă de obicei. Dacă fișierul tău nu se încarcă, atașează un exemplu (fără date personale) la o problemă (issue) și îl adăugăm.

## Același quiz în cele trei forme

JSON:

```json
{
  "title": "Matematică și geografie",
  "questions": [
    { "q": "Cât face 2 + 2?", "options": ["3", "4", "5"], "answer": 1, "time": 15, "explain": "Adunare simplă." },
    { "q": "Care dintre acestea sunt numere prime?", "options": ["2", "9", "11", "15"], "answer": [0, 2] },
    { "q": "Capitala României este…", "options": ["Cluj-Napoca", "București", "Iași"], "answer": "B" }
  ]
}
```

Text simplu (o linie goală între întrebări; primul bloc poate fi `Titlu: …`):

```text
Titlu: Matematică și geografie

Cât face 2 + 2?
A) 3
B) 4
C) 5
răspuns: B
timp: 15
explicație: Adunare simplă.

Care dintre acestea sunt numere prime?
A) 2
B) 9
C) 11
D) 15
răspuns: A C

Capitala României este…
A) Cluj-Napoca
B) București
C) Iași
răspuns: B
```

CSV (un rând de antet; delimitatorul este virgula sau punctul și virgula, după care apare mai des în prima linie):

```csv
intrebare,a,b,c,d,answer,time,explain
Cât face 2 + 2?,3,4,5,,B,15,Adunare simplă.
Care dintre acestea sunt numere prime?,2,9,11,15,A C,,
Capitala României este…,Cluj-Napoca,București,Iași,,B,,
```

În CSV, coloana întrebării se poate numi `question`, `q` sau `intrebare`; celelalte coloane (`a`–`f`, `answer`, `explain`, `time`) au nume englezești.

`test/docs.test.mjs` citește aceste trei exemple cu importatorul real și cere să dea aceleași întrebări.

## JSON

Nivelul de sus este o listă de întrebări sau un obiect care ține lista în `questions` (se acceptă și `items`, `quiz`, `data`) și poate avea un `title` (sau `name`).

- Textul întrebării: `q` (și `question`, `text`, `prompt`, `title`, `name`).
- Variantele: `options` (și `answers`, `choices`, `alternatives`, `variants`, `opts`): de la două la șase șiruri sau obiecte cu textul în `text` (și `label`, `answer`, `option`, `value`, `title`) și, opțional, `"correct": true` (și `isCorrect`, `right`) ca să marchezi variantele corecte.
- Răspunsul corect: `answer` (și `correct`, `correctAnswer`, `correct_answer`, `solution`, `right`, `ans`): un număr, o literă `A`–`F`, un șir de cifre, textul exact al unei variante (majusculele nu contează) sau o listă din acestea când mai multe variante sunt corecte. În loc de acest câmp poți marca variantele, ca mai sus.
- Numerele se numără de la **0**. Pune `"base": 1` (sau `"indexBase": 1`) la nivelul de sus ca să numeri de la 1.
- `time` (și `seconds`, `timeLimit`, `duration`): secunde de la 0 la 600; 0 sau lipsă înseamnă fără cronometru. O valoare în afara intervalului este ignorată, cu o notificare.
- `explain` (și `explanation`, `why`, `feedback`, `note`): o propoziție afișată împreună cu răspunsul.

## Text simplu

Blocurile sunt separate prin linii goale. Într-un bloc de întrebare: întrebarea pe prima linie (poate ocupa mai multe linii înaintea variantelor), variantele ca `A) text`, `A. text` sau `A: text`, în ordine de la A la F, apoi:

- `răspuns: B` — literele sau cifrele corecte, separate prin spații, virgule, punct și virgulă, `|` sau `+` (`răspuns: A C`). Se acceptă și `raspuns:` și `answer:`. **Cifrele se numără de la 1** în acest format.
- `explicație: …` (și `explicatie:`, `explain:`, `why:`) și `timp: 15` (și `time:`), ambele opționale.
- Un prim bloc fără variante poate fi `Titlu: …` (și `title:`, `titre:`, `titel:`, `título:`, `titolo:`, `cím:`).

## CSV

Primul rând numește coloanele, în orice ordine și cu orice majuscule: `question` (și `q`, `intrebare`), variantele `a`–`f` (și `option1`–`option6`), `answer` și, opțional, `explain` și `time`. Celulele cu virgule, punct și virgulă sau rupturi de rând se pun între ghilimele duble (`""` pentru o ghilimea). În `answer`, litere sau cifre separate prin spații, `|` sau `+`; **cifrele se numără de la 1**, ca în formatul text.

## Limite și notificări

- Cel mult 200 de întrebări; de la 2 la 6 variante pe întrebare; textul unei întrebări de cel mult 300 de caractere, al unei variante de 120, al unei explicații de 300 și un titlu de 80. Un text mai lung este tăiat, iar notificarea `w_trunc` spune care întrebare. Un fișier mai mare de 512 KB este refuzat. Un quiz salvat pe dispozitiv (permisiunea `storage`) poate avea cel mult 12000 de caractere, iar dispozitivul păstrează până la cinci.
- Erori (quiz-ul nu se încarcă): `e_empty` nu există nimic de citit; `e_format` format necunoscut; `e_json` JSON invalid; `e_noq` nu s-a găsit nicio întrebare; `e_many` peste 200 de întrebări; `e_qtext` o întrebare fără text; `e_opts` mai puțin de 2 sau mai mult de 6 variante ori o variantă goală; `e_ans` răspunsul corect lipsește sau nu corespunde niciunei variante. Mesajele despre o întrebare îi spun numărul.
- Notificări (quiz-ul se încarcă): `w_trunc` un text a fost scurtat; `w_time` o limită de timp în afara intervalului 0–600 a fost ignorată.

## Cum rulează

- Telefoanele primesc doar întrebarea și variantele. Răspunsul corect rămâne pe proiector până apeși **Arată răspunsul**.
- Un răspuns corect valorează 1000 de puncte. Când întrebarea are limită de timp, se adaugă până la 500 în proporție cu timpul rămas. La o întrebare cu mai multe răspunsuri corecte, mulțimea aleasă trebuie să fie exact cea corectă; un răspuns greșit sau lipsă valorează 0.
- Clasamentul dă același loc scorurilor egale (1, 2, 2, 4). Poți ascunde numele din clasament.
- **Salvează rezultatele** scrie un CSV cu nume și scoruri prin descărcarea din browser; un nume care ar putea rula ca formulă într-o foaie de calcul primește un apostrof în față.
