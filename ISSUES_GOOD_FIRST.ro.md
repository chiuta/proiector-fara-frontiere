# Sarcini bune pentru început

[English](ISSUES_GOOD_FIRST.md) · **Română** · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Testează întregul flux pe un iPhone real (Safari) și pe un telefon Android real (Chrome) cu lista de verificare din `docs/compat.md` și adaugă-ți rândurile în tabelul de acolo
- [ ] Încearcă asocierea într-o rețea de acasă, într-un Wi-Fi școlar sau pentru oaspeți care izolează dispozitivele și printr-un hotspot mobil; consemnează în `docs/compat.md` ce merge și mesajele de eroare exacte
- [ ] Procură un fișier de quiz Undava real (sau specificația lui publicată) și fă importatorul de quiz să-l citească, cu un test și o notă în `docs/quiz-format.md`
- [ ] Adaugă un widget „ridică mâna”: telefoanele se așază la coadă, proiectorul arată ordinea și îl lasă pe profesor să-l cheme pe următorul (permisiunea `none`)
- [ ] Adaugă un widget de tip „bilet de ieșire”: fiecare telefon alege o față sau un număr de la 1 la 5 și poate adăuga un comentariu scurt; proiectorul arată totalurile și comentariile, cu export CSV
- [ ] Adaugă un widget de formare a grupelor: proiectorul împarte telefoanele conectate în grupe de o mărime aleasă, cu un buton de amestecare, iar fiecare telefon își vede grupa
- [ ] Quiz: adaugă un al doilea CSV cu răspunsul fiecărui telefon la fiecare întrebare, ca profesorul să vadă cine a greșit ce
- [ ] Auditează pagina cu un cititor de ecran (NVDA sau VoiceOver) și numai cu tastatura, repară ce nu este anunțat sau nu poate fi atins și consemnează rezultatul în `docs/compat.md`
- [ ] Revizuiește traducerile automate ale interfeței și ale widgeturilor (fr, de, es, it, pt, hu) și corectează ce nu ar spune un vorbitor nativ
- [ ] Extinde testul din browser al hubului (`tests/proiector.test.mjs`) la zece sau mai multe telefoane simulate care desenează simultan și raportează cât de receptiv rămâne proiectorul

Creează-le pe toate pe GitHub cu `scripts/create_issues.sh` (cere CLI-ul `gh`).
