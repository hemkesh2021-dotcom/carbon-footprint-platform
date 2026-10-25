# CarbonWise · Carbon Footprint Platform

A Next.js application for estimating a personal carbon footprint, exploring category breakdowns, tracking habits and setting reduction goals. Built with TypeScript, React, Tailwind CSS and Recharts.

## Explore the app

- **Calculator:** enter transport, home energy, food, shopping, waste and travel activity.
- **Dashboard:** review your footprint, category breakdowns, goals and recommendations.
- **Habits:** track sustainable actions and completion streaks.
- **Insights:** compare assessments and explore trends.
- **Education:** learn about emissions and practical ways to reduce them.

Assessment, goal and habit data are stored in the browser's localStorage. This is not a multi-device account service: clearing browser storage can erase your data, and a different browser or origin has separate storage.

## Run locally

Use Node.js 22 and npm, consistent with the repository's Docker base image.

```bash
git clone https://github.com/hemkesh2021-dotcom/carbon-footprint-platform.git
cd carbon-footprint-platform
npm install
npm run dev
```

Open <http://localhost:3000>. Start with the calculator, then explore the dashboard, habits, insights and education pages. The current browser-storage implementation does not require an account, database or API key.

Dependency installation requires network access. The app uses Inter through `next/font/google`, so a production build may also need access to Google's font service.

**Dependency caveat:** the existing [build-repair PR](https://github.com/hemkesh2021-dotcom/carbon-footprint-platform/pull/1) addresses lockfile reproducibility and dependency updates separately. The setup above follows the current Dockerfile's `npm install` approach; it can modify `package-lock.json`. Review any lockfile changes rather than treating installation as a reproducibility or security check.

## Development checks

The available scripts and type-check command are:

```bash
npm run lint
npm test -- --runInBand
npm run test:coverage
npx tsc --noEmit
npm run build
```

Tests cover calculation logic, formatting, validation, storage, services, components and integration flows. These commands describe how to check the project; they are not a claim that the current branch passes every check. Also review the complete calculator journey, persisted data and responsive layouts in a browser.

## Calculation methodology

Calculation logic lives in [calculator.ts](src/lib/calculator/calculator.ts); emission factors and source notes live in [emission-factors.ts](src/lib/calculator/emission-factors.ts). Comparison benchmarks are in [benchmarks.ts](src/constants/benchmarks.ts).

Review these assumptions before interpreting a result. Estimates depend on self-reported activity, fixed conversion factors and category approximations. They are not an independently verified emissions inventory, and the factors are not fetched or updated automatically.

## Containers and deployment

The [Dockerfile](Dockerfile) builds a standalone Next.js server using Node.js 22 and runs it as a non-root user on port 8080:

```bash
docker build -t carbonwise .
docker run --rm -p 127.0.0.1:8080:8080 carbonwise
```

Open <http://127.0.0.1:8080>. The current Dockerfile installs dependencies with `npm install`, not `npm ci`.

[cloudbuild.yaml](cloudbuild.yaml) contains image-build, push and Cloud Run deployment steps; [service.yaml](service.yaml) contains a service configuration. These require your own Google Cloud setup and review of project-specific values. The current Cloud Build configuration does **not** run lint, tests or type checking before deployment. Do not treat the deployment configuration as evidence of a verified hosted demo.

## Repository layout

| Path | Purpose |
| --- | --- |
| `src/app/` | Landing, calculator, dashboard, habits, insights and education routes |
| `src/components/` | Feature components and shared interface controls |
| `src/lib/` | Calculation, comparison, recommendation and insight logic |
| `src/constants/` | Benchmarks, categories and educational content |
| `src/services/` | Browser storage and assessment, goal and habit operations |
| `src/hooks/` | React hooks for application state |
| `src/types/` | Shared TypeScript models |
| `__tests__/` | Unit, component and integration tests |
| `Dockerfile`, `cloudbuild.yaml`, `service.yaml` | Container and deployment configuration |

## Current limitations

- Local browser storage is not an account system, backup or cross-device sync.
- Estimates and comparisons depend on the assumptions in the source, not a live regional emissions dataset.
- Build and dependency repairs are tracked separately in PR #1; this README does not include those code changes.
- No standalone license file is included in the repository. Do not assume an open-source license from repository visibility alone.
