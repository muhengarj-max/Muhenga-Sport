# Muhenga Sport

Premium sports streaming web app built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Axios, and HLS.js.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## API

Muhenga Sport uses the Streamed API at:

```text
https://streamed.pk/api
```

Implemented endpoints:

- `GET /matches/live`
- `GET /matches/all-today`
- `GET /matches/all`
- `GET /matches/{sport}`
- `GET /stream/{source}/{id}`
- `GET /sports`
- `GET /images/badge/{id}.webp`
- `GET /images/poster/{homeBadge}/{awayBadge}.webp`

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` creates a production build.
- `npm run start` serves the production build.
- `npm run typecheck` runs TypeScript validation.
