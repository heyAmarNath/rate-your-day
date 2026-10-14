# Rate Your Day
[Try](https://rate-your-day.amarsite.workers.dev/day)

Rate each day (Awful, Bad, Okay, Good, Great) and see your days in color — Day, Week, Month and Year views.
Installable, offline-first PWA. Data stays in your browser (IndexedDB); export a JSON backup from Settings.

## Rules
- Only **today** can be rated; you can change it until local midnight. Past days are read-only.
- Colors: Awful red · Bad orange · Okay yellow · Good lime · Great green · gray = not rated. (Stored internally as 1–5.) Weeks start Monday.

## Develop
```sh
npm install
npm run dev      # http://localhost:3000 (service worker disabled in dev)
npm test         # unit tests (Vitest + fake-indexeddb)
npm run build    # static export to out/, with service worker
npx serve out    # test the PWA / offline locally
npm run icons    # regenerate PNG icons from public/icons/icon.svg
```

## Structure
- `src/lib/entries.ts` — the only data access layer (`upsertToday` enforces the today-only rule; import/export merge by `updatedAt`). Future sync plugs in here.
- `src/lib/dates.ts` — local `YYYY-MM-DD` keys, Monday-start weeks, month grid and year heatmap layout.
- `src/lib/colors.ts` — rating → color map.
- `src/app/{day,week,month,year,settings}` — views; `src/app/sw.ts` — Serwist service worker.
