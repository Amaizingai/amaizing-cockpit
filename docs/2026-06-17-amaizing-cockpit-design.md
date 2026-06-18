# Amaizing Cockpit — Design Spec
> Dato: 2026-06-17
> Status: Godkendt af Søren Madsen

---

## Formål

Internt operationelt værktøj til Søren og Rooba. Lav friktion — åbn appen, optag en tanke, den er gemt. Bruges primært på mobil, men fungerer på alle skærme.

---

## Scope (MVP)

**Inkluderet:**
- Voice capture: tryk for at starte, tryk igen for at stoppe
- Auto-transskription via Web Speech API
- AI-forslag til kategori (Idé / Lead / Opgave / Note)
- Idé-board med filtrering på kategori og afsender
- Lokal lagring (localStorage) — SharePoint kobles til i step 2

**Ikke inkluderet i MVP:**
- SharePoint-sync
- Make-webhook-integration
- Agent-aktivering
- Lead-logger
- Status-overblik

---

## Arkitektur

Én HTML/CSS/JS-app uden framework og uden server. Kører i browseren — gemmes som bogmærke eller installeres som PWA (Progressive Web App) på hjemskærm.

```
amaizing-cockpit/
  ├── index.html          ← app-shell, routing, bundnavigation
  ├── capture.js          ← Web Speech API (optagelse + live transskription)
  ├── store.js            ← localStorage read/write/sync-flag
  ├── ai.js               ← auto-kategorisering
  └── ideas.js            ← idé-board visning og filtrering
```

---

## Datamodel

Hvert element gemmes som JSON i `localStorage` under nøglen `amaizing_items`:

```json
{
  "id": "uuid-v4",
  "text": "Transskriberet tekst eller manuel note",
  "category": "idea | lead | task | note",
  "author": "Søren | Rooba",
  "created": "2026-06-17T14:32:00Z",
  "synced": false
}
```

`synced: false` markerer poster der venter på SharePoint-upload i step 2.

---

## Komponenter

### Voice Capture (Hjem-skærm)

- Stor central knap
- **Tryk** → optagelse starter (`MediaRecorder` + `SpeechRecognition`)
- Knap skifter til rød puls med tidstæller
- **Tryk igen** → optagelse stoppes → transskription vises
- AI foreslår kategori baseret på tekstindhold
- Bruger kan justere kategori med ét tryk
- Tryk "Gem" → gemt i localStorage → bekræftelse vises

### Idé-board

- Liste over alle gemte poster, nyeste øverst
- Filtertabs: Alle / 💡 Idéer / 🎯 Leads / ✅ Opgaver / 📝 Noter
- Hvert kort viser: tekst, kategori-chip, afsender, dato
- Swipe eller langt tryk → slet eller rediger
- Synkroniseringsstatus vises når SharePoint er koblet til

---

## Visuelt design

Følger Amaizing brand guide (`_REGLER/01_BRAND_GUIDE.md`):

| Element | Værdi |
|---------|-------|
| Baggrund | `#06040a` (Deep Void) |
| Panel | `#130c1b` (Night Panel) |
| Primær accent | `#d89a74` (Kobber) |
| Primær tekst | `#f5f1f7` (Soft White) |
| Sekundær tekst | `#c9bfce` (Muted Lavender) |
| Optager (aktiv) | `#e05555` (rød puls) |

Navigation: bundmenu med 4 punkter — Optag, Idéer, Log, Mere.

---

## Step 2 — SharePoint-integration

Når SharePoint er klar tilføjes:

1. Make-webhook modtager poster med `synced: false`
2. Make skriver til SharePoint-liste
3. Make sender notifikation (Teams eller Outlook) til den anden part
4. App sætter `synced: true` ved bekræftelse

Appen håndterer dette med én funktion i `store.js` — ingen arkitekturændringer.

---

## Succeskriterier

- Optagelse starter med ét tryk
- Transskription er klar inden 3 sekunder efter stop
- Gemmes uden internetforbindelse
- Virker på iOS Safari og Android Chrome
- Kan installeres på hjemskærm (PWA)
