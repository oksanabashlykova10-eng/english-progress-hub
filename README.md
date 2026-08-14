# English Progress Hub

A polished, clickable frontend prototype for tracking students' English summative-assessment progress. It includes Russian-language teacher dashboards and journal views, a teacher-facing student profile, and an English-language student portal with progress charts, goals, comments, and achievements.

This prototype uses mock data only. It intentionally has no backend, Firebase connection, or real authentication.

## Technology

- React
- Vite
- JavaScript
- React Router
- Lucide React icons
- Custom dependency-free SVG charts

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The login button opens the teacher dashboard, and **View Student Demo** opens the student portal.

## Production build

```bash
npm run build
npm run preview
```

Mock content lives in `src/data/mockData.js`, keeping the UI ready for a later Firebase data layer.
A student progress tracker for English summative assessments.
