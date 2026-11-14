# CONSORTIUM-01

## User priority: UI/UX only

The user explicitly limits this project to UI/UX design. Prioritize visual quality,
layout, typography, spacing, color, responsive behavior, and clear interaction
states. Backend implementation, business-logic correctness, authentication,
security hardening, and production integrations are outside the requested scope.
Do not expand design work into those areas. Existing demo data, local state, and
simulated submissions are sufficient for presenting and evaluating the experience.
Implement only the lightweight behavior needed to demonstrate the UI: navigation,
tabs, filters, dialogs, selection, loading, previews, and success/empty/error states.

Preserve the established Persian storefront identity and Vazirmatn typography
unless the user requests a redesign. Do not turn a targeted UI task into a wholesale
visual migration to the package's generic canvas, navigation rail, or typography.
This explicit user preference takes precedence over generic package aesthetics.
Reuse existing shared UI components and project tokens for a coherent experience.

## Scope and required reading

These instructions apply throughout this repository. `CLAUDE.md` delegates to this
file. Follow explicit user requests first, then these instructions and
[guidelines/Guidelines.md](guidelines/Guidelines.md).

Before changing application code, read the project guidelines and the design-system
files they require, using these exact installed-package paths:

1. `node_modules/@figma/astraui-kit/guidelines/setup.md`
2. `node_modules/@figma/astraui-kit/guidelines/Guidelines.md`
3. `node_modules/@figma/astraui-kit/guidelines/overview.md`
4. All Markdown files in that package's `guidelines/foundations/` directory.
5. `node_modules/@figma/astraui-kit/guidelines/components/overview.md`

Read the relevant component guidelines before using a component, composition
guidelines before building layouts, and `icon-discovery.md` before adding icons.
pnpm packages may be symlinked: read exact paths or list the package directory;
do not rely on recursive file discovery to find package documentation.
Apply required setup to this project, never to files inside `node_modules`.

There is an existing mismatch between these guidelines and the application; see
the baseline notes below. This document records current implementation details;
those details do not override the mandatory design-system instructions. A
documentation-only task should record discrepancies without changing app setup.

## Product and stack

- Persian, right-to-left wallpaper storefront and customer dashboard.
- React 18.3.1, TypeScript with strict checking, Vite 6.3.5, Tailwind CSS 4.1.12.
- React Router 7 through `react-router`, using `createBrowserRouter`.
- Existing shared UI wrappers use Radix primitives and shadcn-style components.
- Icons come from `lucide-react`; animations also use `motion/react`.
- Checkout includes Leaflet/react-leaflet mapping.
- This is currently a client-side prototype. Catalogs, dashboard series, orders,
  pricing, and many form flows use inline demo data and component state. No
  backend/API integration was found in application source. Do not describe demo
  login, payments, uploads, or order confirmation as production integrations.

## Toolchain and commands

`.mise.toml` specifies Node 22 and pnpm 10.34.3. Prefer pnpm; the project has
`pnpm-lock.yaml` and `pnpm-workspace.yaml`. A `package-lock.json` also exists;
avoid switching package managers or regenerating both lockfiles incidentally.

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Vite development server through the Figma wrapper |
| `pnpm build` | Production bundle through `vite.figma.config.ts` |
| `pnpm preview` | Preview the production bundle |
| `pnpm exec tsc --noEmit` | Type-check source and Vite configuration |
| `pnpm exec oxfmt --check AGENTS.md` | Check formatting of this document |
| `pnpm format` | Run oxfmt; may format the whole repository |

There are no `test`, `lint`, or `typecheck` package scripts. Do not invent them in
reports. Use targeted formatting rather than formatting unrelated files.
On Windows, `npm.cmd run build` is an alternative when pnpm is unavailable;
`node node_modules/typescript/bin/tsc --noEmit` uses the installed compiler directly.

Inside Figma Make, the development server is normally already running with hot
reload. Reuse it. The wrapper reads `PORT`, defaulting to 8443, with `strictPort`.
Check availability before starting a second server in a local checkout.
`pnpm-workspace.yaml` currently limits supported dependency architectures to Linux;
inspect that setting when diagnosing a fresh Windows dependency installation.

## Requested GitHub publication

The user selected a public GitHub repository and GitHub Pages. The workflow in
`.github/workflows/deploy-pages.yml` builds and deploys pushes to `main` once the
owner's repository and Pages are connected. See `DEPLOYMENT.md` for setup and
current prerequisites; the local workflow is not proof that GitHub is connected.
The user also requested Write access for `gwall2524-lab`; verify the actual
repository and account before inviting, and confirm the returned access state.
Future requested changes should be committed and pushed to the owner's connected
GitHub repository after relevant checks, so its Pages workflow publishes them.
GitHub Pages and the prior Sites publication have separate URLs and deployment
pipelines. Do not report a GitHub push as an update to the old Sites URL.

## Source map

| Location | Responsibility |
| --- | --- |
| `src/main.tsx` | React root, StrictMode, global stylesheet import |
| `src/app/App.tsx` | RouterProvider |
| `src/app/routes.ts` | Route definitions and legacy redirects |
| `src/app/pages/` | Page components, inline demo data, page-specific helpers |
| `src/app/components/Header.tsx` | Navigation, mini-cart, local user helpers |
| `src/app/components/Footer.tsx` | Shared footer |
| `src/app/components/ui/` | Existing reusable UI primitives; `utils.ts` exports `cn` |
| `src/app/components/figma/ImageWithFallback.tsx` | Image component with error fallback |
| `src/app/store/cart.ts` | Persisted cart item model and item-based operations |
| `src/app/lib/cart.ts` | Separate count-only cart helpers |
| `src/styles/index.css` | Active CSS entry: fonts, Tailwind, theme |
| `src/styles/theme.css` | Semantic variables, dark variants, base typography |
| `src/styles/fonts.css` | Vazirmatn font import |
| `src/styles/tailwind.css` | Tailwind v4 source scanning and animation CSS |
| `src/imports/` | Imported product, brand, logo, and promotional assets |
| `public/images/` | Public assets, including promotion hero and album cover |
| `vite.config.ts` | App-owned React/Tailwind plugins and `@` alias |
| `vite.figma.config.ts` | Figma asset resolution, HTML metadata, HMR, server wrapper |
| `.figma/make/` | Figma site metadata and migrated package aliases |

`src/styles/globals.css` and `default_shadcn_theme.css` also exist; the active
entry point imports `src/styles/index.css`. Trace imports before editing styles.
The `@/` alias resolves to `src/` in both Vite and TypeScript.

## Routes

| Path | Page |
| --- | --- |
| `/` | `Home.tsx` (`HomePage`) |
| `/product/:name` | `ProductPage.tsx` |
| `/brand/:name` | `BrandPage.tsx` |
| `/brand/:brandName/album/:albumSlug` | `AlbumPage.tsx` |
| `/discounts` | `DiscountsPage.tsx` |
| `/discounted-products` | `DiscountedProductsPage.tsx` |
| `/compare` | `ComparePage.tsx` |
| `/login`, `/otp` | `LoginPage.tsx`, `OtpPage.tsx` |
| `/profile` | `ProfilePage.tsx` |
| `/profile/pricing-details` | `SalesPricingDetailsPage.tsx` |
| `/cart`, `/checkout`, `/order-confirm` | Corresponding purchase-flow pages |

Keep legacy redirects `/dicount` to `/discounts` and `/product` to `/` unless the
task explicitly changes them. `ProfileOrdersPage.tsx` exists but is not registered
in the router; do not assume that its filename implies a reachable URL.
Profile sections mostly switch within `ProfilePage`, rather than separate routes.
Use `Link` and `useNavigate` from `react-router` for internal navigation. Keep route
parameter names consistent with `useParams` and existing links. Preserve navigation
state such as the login phone number and checkout's `openBox` option.

## State and persistence contracts

- `src/app/store/cart.ts` defines `CartItem`: `id`, `name`, `code`, `unitPrice`,
  `qty`, and optional `img`. The full cart is stored under `kd_cart`.
- Its `addToCart(item)` merges by `id`, saves items, recalculates `cartCount`,
  and dispatches the window event `cartUpdate`.
- `saveCart(items)` only writes `kd_cart`; it does not update the count or emit
  an event. Inspect each caller when changing quantity/removal behavior.
- `src/app/lib/cart.ts` exports a different `addToCart(qty)` plus count helpers.
  These change only `cartCount` and dispatch `cartUpdate`; they do not create items.
  Never confuse the two functions or add another persistence implementation.
- `Header` listens for `storage` and `cartUpdate`. The native storage event does
  not notify its originating tab. Verify both badge and mini-cart after mutations.
- `consortiumUser` stores a display name. `getUser`, `setUser`, and `clearUser`
  currently live in `Header.tsx`. This is demo identity, not authentication.
- OTP confirmation currently sets a demo user without server verification.
- Keep storage keys and event names compatible unless a migration is requested.
  Persistence details are context for UI interactions, not a request to harden storage.

## UI and editing conventions

- Keep Persian content in UTF-8. Preserve RTL page direction and explicit LTR
  regions for telephone numbers, codes, charts, and other mixed-direction content.
- Existing pages use Vazirmatn and Persian numeric formatting such as
  `toLocaleString("fa-IR")`. Preserve displayed currency units and numeric values;
  do not silently convert rial/toman or replace Persian dates with Gregorian dates.
- Read surrounding code and follow its export/import conventions. Pages generally
  use named exports, while `App` uses a default export.
- Keep changes focused. `ProfilePage.tsx` and `SalesPricingDetailsPage.tsx` each
  contain thousands of lines and many local components. Identify the exact
  component and its dependencies before editing; extract cohesive code when the
  task warrants it, without broad unrelated rewrites.
- Pricing details include brand selection/confirmation, charts, date filters,
  promotional content, media interactions, and dialogs. Preserve confirmation
  locking, loading states, scroll targets, and timer cleanup when editing them.
- Follow required design-system setup and component documentation for new UI.
  Existing local `ui/` wrappers are implementation context, not proof of an Astra
  component's API. Reuse shared application components where appropriate.
- Preserve React and Tailwind Vite plugins. Keep normal application configuration
  in `vite.config.ts`; avoid incidental edits to the Figma wrapper or metadata.
- Use existing asset imports or public URLs. Preserve filename casing exactly:
  Linux builds are case-sensitive even when a Windows build accepts a mismatch.
  `figma:asset/` resolution is handled by the Figma wrapper; do not replace it
  casually. Use the shared image fallback where appropriate.
- Use accessible names, associated form labels, keyboard activation, visible focus,
  and dialog focus behavior. Respect reduced-motion preferences for new animation.
- Effects must clean up timers and listeners and tolerate StrictMode remounts.
  Revoke object URLs when changing file-preview lifecycles.
- Do not commit generated `dist/`, dependencies, credentials, or local environment
  files. Do not edit installed dependency source to fix application behavior.

## Verification and known baseline

Baseline observed on 2026-11-09; recheck before treating these as current failures:

- Production build succeeds. Vite warns about a JavaScript chunk over 500 kB;
  several imported PNGs also exceed 2 MB. Routing currently uses eager imports.
- Type checking fails at `vite.figma.config.ts:84` with TS2349 (`never` is not
  callable) in the conditional invocation of the imported user configuration.
  A successful Vite build does not establish that TypeScript passes.
- The project declares `@figma/astraui-kit`, but not the separate
  `@figma/astraui` dependency required by its setup guide. The active app also
  lacks that package's stylesheet import and root ThemeProvider. Current white
  storefront layouts and Vazirmatn differ from the package's documented lavender
  canvas, navigation rail, and typography. Do not claim Astra setup is complete;
  follow mandatory setup for code work unless the user explicitly overrides it.
- Count-only additions and item-based cart operations coexist. `CartPage` saves
  quantity/removal edits without emitting `cartUpdate`, so header state can lag.
- `ProfilePage.tsx` now matches the asset's `Capture02.PNG` casing for Linux builds.
- No automated test suite is configured. Browser interaction and responsive layout
  have to be checked separately from build/type checks.

For UI changes, run the production build when appropriate to confirm the app still
bundles. The TypeScript check is a diagnostic, with the known failure above; do not
let unrelated existing logic/configuration issues grow the design task. Visually
check the affected page in narrow and desktop layouts when a browser is available.
Prioritize hierarchy, readable Persian text, RTL/LTR alignment, spacing, overflow,
image treatment, hover/focus states, dialogs, and clear feedback. Exercise the
interaction states being designed with demo data; production data integrity and
backend/security testing are outside scope. For pricing details, inspect brand
selection/confirmation, chart/filter presentation, media cards, and dialog states.
For documentation-only changes, verify paths and commands without modifying app
behavior. Report which checks actually ran and any limitations; never claim browser
or automated test coverage that was not performed.
