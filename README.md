# Carbon Footprint Platform

A Next.js application for estimating a personal carbon footprint, exploring category breakdowns, tracking habits and setting reduction goals. Built with TypeScript, React, Tailwind CSS and Recharts.

## Run locally

Use Node.js 22.12 or newer.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Start with the calculator, then explore the dashboard, habits, insights and education pages. Assessment and habit data are stored in the browser; this is not a multi-device account service. Clearing browser storage can erase local data.

## Verify changes

```bash
npm run lint
npm test -- --runInBand
npx tsc --noEmit
npm run build
```

Cloud Build runs lint, tests and type checking before building and deploying the container. Docker installs from the committed lockfile. Cloud deployment requires your own configured Google Cloud project; no hosted demo is claimed here.

## Calculation methodology

Calculation logic lives in `src/lib/calculator/calculator.ts`; emission factors and their source notes live in `src/lib/calculator/emission-factors.ts`. Comparison benchmarks are in `src/constants/benchmarks.ts`. Review these assumptions before interpreting a result. Estimates depend on self-reported activity, regional factors and category approximations; they are not an independently verified emissions inventory.

## Layout

- `src/app`: calculator, dashboard, habits, insights and education routes.
- `src/components`: feature components and shared interface controls.
- `src/services`: browser storage and assessment, goal and habit operations.
- `__tests__`: calculator, validation, storage, service and component tests.
- `Dockerfile`, `cloudbuild.yaml`, `service.yaml`: deployment configuration.

## Next improvements

Publish dated factor sources and uncertainty ranges, add an accessible screenshot and a verified demo URL, and document a browser-data export/restore workflow. Automated checks do not substitute for checking the complete calculator journey in a browser.
