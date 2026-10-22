# MCCIA MSME Helpline Tracker

A new, standalone React and TypeScript application for recording and tracking MSME helpline enquiries. This project has no connection to any prior Lovable app or database.

## Development

Requires Node.js 24 (see `.nvmrc`) and npm.

```sh
npm ci
npm run dev
```

Vite serves the app on port 5173. On a restricted cloud machine, use `npm --cache /tmp/mccia-npm-cache ci` if the default npm cache is not writable.

```sh
npm test          # interaction and persistence tests
npm run build     # strict TypeScript check and production bundle
npm run preview   # serve the production bundle on port 4173
```

## Initial features

- Create enquiries with company, contact, topic, and summary.
- Move enquiries between Open, In progress, and Resolved.
- View totals, search records, and filter by status.
- Persist records in this browser's local storage.
- Responsive layout and labelled form controls.

## Data and scope

This is an initial browser-only prototype. It starts empty and has no backend, authentication, database, external API, analytics, or existing data import. Browser data is not shared between users or devices and may be lost if browser storage is cleared. Do not use it for sensitive or production records. A secure backend, access controls, backups, audit history, and deployment are future work requiring explicit configuration.

No environment variables or credentials are required. Never commit secrets or real enquiry records. The application makes no runtime requests to Lovable or any database.

## Structure

- `src/App.tsx`: enquiry workflow and browser persistence
- `src/styles.css`: responsive interface
- `src/App.test.tsx`: interaction and persistence validation
- `.github/workflows/ci.yml`: test and build checks

Each cloud task already has an isolated checkout; work in the existing repository without creating additional Git worktrees unless requested.
