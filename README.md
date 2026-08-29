# Three-Way Match Engine

Upload Purchase Order (PO), Goods Receipt Note (GRN), and Invoice documents; the backend extracts structured data via the Gemini API, resolves each line item against a SKU Master catalogue, persists everything in MongoDB, and reconciles the three documents into a live match result. The frontend surfaces that reconciliation through per-PO tabs matching the assignment's reference screens.

- `backend/` — Node.js, Express, MongoDB (Mongoose), Gemini API
- `frontend/` — Next.js (App Router), Tailwind CSS, TanStack Query
- `samples/` — real API responses (parsed Gemini output, a `/match` result, a `/summary` result) — see [`samples/README.md`](samples/README.md)

## Setup & Run

**Prerequisites**: Node.js 22+, a running MongoDB instance (`mongodb://localhost:27017` by default), a Gemini API key ([Google AI Studio](https://aistudio.google.com/apikey)).

### Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env — at minimum set GEMINI_API_KEY
npm start          # nodemon src/index.js, http://localhost:3000
```

`backend/.env.example`:

```
PORT=3000
NODE_ENV=development

DEV_DB_URL=mongodb://localhost:27017/finifi-assignment
PROD_DB_URL=

JWT_SECRET=change-me
JWT_EXPIRY=1h

GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.6-flash

CORS_ORIGIN=http://localhost:3001
```

`GEMINI_MODEL` defaults to `gemini-3.6-flash`; override it if that model is unavailable on your API key's tier — the app already hit exactly this once during development (a stale default model name), and it fails clearly (422, no crash) rather than silently.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev         # http://localhost:3001 (falls back to another port if 3000 is taken by the backend)
```

`frontend/.env.example`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

### First login

The assignment only requires a static-token login, but this backend implements full email/password auth (see [Assumptions](#assumptions--deviations-from-the-minimum-spec)) — there's no seeded user, so create one via the app's own **Sign up** screen (linked from the login page), or directly:

```bash
curl -X POST http://localhost:3000/api/v1/users/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","username":"yourname","password":"yourpassword"}'
```

## Approach

Requests flow through the same layering on the backend for every resource: `routes` → `validators` (zod) → `controllers` → `services` → `repositories` → `schemas` (Mongoose). A generic `crudRepository` factory backs the simple CRUD paths (SKU Master), while document upload and matching get their own service-layer logic. The upload pipeline, master resolution, and duplication check are implemented as plain sequential functions, not a plugin/engine abstraction — per the assignment's own guidance that no such abstraction is expected at this scope.

The frontend mirrors this: `lib/apiClient.js` (a framework-agnostic fetch wrapper) → `lib/api/*Api.js` (one file per resource) → `hooks/*.js` (TanStack Query wiring) → components. See [Frontend architecture](#frontend-architecture--state-management) for the reasoning behind that choice.

## Data model

| Model | Key fields |
|---|---|
| `SkuMaster` | `skuErpCode` (unique), `name`, `eanCode`, `hsnCode`, `uom`, `agreedRate`, `mrp`, `priceTolerance` |
| `PurchaseOrder` | `poNumber`, `poDate`, `vendorName`, `items[]` (`itemCode`, `description`, `quantity`, `skuMaster` ref, nullable), `rawParsed`, file fields |
| `Grn` | `grnNumber`, `poNumber` (plain string link, not a Mongo ref), `grnDate`, `items[]` (`itemCode`, `description`, `receivedQuantity`, `mrp`, `skuMaster` ref, nullable), `rawParsed`, file fields |
| `Invoice` | `invoiceNumber`, `poNumber`, `invoiceDate`, `items[]` (`itemCode`, `description`, `quantity`, `unitRate`, `mrp`, `skuMaster` ref, nullable), `rawParsed`, file fields |
| `MatchAudit` | `poNumber`, `steps[]` (`{ step, status, message, at }`) — one growing log document per PO, one step entry appended per upload event |

`poNumber` deliberately has **no unique constraint** on `PurchaseOrder`, and `Grn`/`Invoice` have **non-unique** compound indexes on `{poNumber, grnNumber}` / `{poNumber, invoiceNumber}` — the spec requires duplicates to be *stored*, not rejected ("store it anyway, don't overwrite, surface the conflict"), so a unique index would silently break the exact scenario the duplication check exists to catch. This was caught during implementation, not anticipated up front — the schemas were first written with unique constraints, and fixed once the duplication logic exposed the contradiction.

## Parsing flow

1. `POST /documents/upload` receives `file` + `documentType` (multer, disk storage, PDF/PNG/JPEG only)
2. The file is base64-encoded and sent to Gemini (`@google/genai`) with a document-type-specific prompt requesting a fixed JSON shape
3. The response is validated against a zod schema for the minimum required fields; **on failure, the whole call retries once**, then fails with a clear 422 (never persists a partial/malformed document)
4. Each item is resolved against `SkuMaster`: exact match on `skuErpCode` (case-insensitive, trimmed), falling back to `eanCode`. Unresolved items are **never dropped** — they persist with `skuMaster: null` and surface as `unmapped_master_sku`
5. The document is persisted independently of whether a PO with that `poNumber` exists yet (see [Out-of-order handling](#out-of-order-handling))
6. A duplication check runs by counting existing documents for that key (see [Duplicate handling](#duplicate-handling))
7. One step is appended to that `poNumber`'s `MatchAudit.steps[]`

## Matching-key rationale

Item identity across PO/GRN/Invoice is the resolved `SkuMaster._id` — this is the whole point of master resolution: a PO line reading `BIK-BIKANERI-200G` and a GRN line reading `Bikaji Bikaneri Bhujia 200 G Pp` are the same physical product only once both resolve to the same catalogue record. When an item can't be resolved, the fallback key is the normalized raw `itemCode` (trimmed, lowercased), tagged `unmapped_master_sku`, so it still aggregates correctly against repeated occurrences of the same unresolved code without ever being silently discarded.

One detail worth being explicit about: resolution happens at upload time and is **not written back** to a document once it succeeds. `GET /match/:poNumber` re-resolves any still-unmapped item on every read, so a SKU Master created *after* the fact is picked up on the next match without needing to re-upload anything — this was specifically tested by uploading an unresolved item, creating its SkuMaster afterward, and confirming `/match` resolved it with zero re-upload.

## Matching logic

Validation happens at item level and rolls up to a PO-level status.

| Reason code | Rule |
|---|---|
| `grn_qty_exceeds_po_qty` | Total received qty (all GRNs) exceeds PO qty |
| `invoice_qty_exceeds_grn_qty` | Total invoiced qty exceeds total GRN qty |
| `invoice_qty_exceeds_po_qty` | Total invoiced qty exceeds PO qty |
| `invoice_date_after_po_date` | Any invoice dated after the PO |
| `duplicate_po` | A second PO exists for this `poNumber` |
| `duplicate_document` | A GRN/Invoice number is reused under this `poNumber` |
| `item_missing_in_po` | Item on a GRN/Invoice has no corresponding PO item |
| `price_mismatch` | Invoice `unitRate` differs from `SkuMaster.agreedRate` by more than `priceTolerance` |
| `mrp_mismatch` | Invoice/GRN `mrp` differs from `SkuMaster.mrp` by more than ~1% |
| `unmapped_master_sku` | Item could not be resolved to any `SkuMaster` |

Status ladder, in priority order: **`insufficient_documents`** (the full PO+GRN+Invoice set isn't uploaded yet — missing types are never treated as zero quantities) → **`mismatch`** (any hard violation above `duplicate_document`) → **`partially_matched`** (soft warnings only, or quantities not yet fully reconciled) → **`matched`**.

`GET /match/:poNumber` and `GET /summary/:poNumber` always recompute from whatever is currently stored — nothing is cached. Missing rates/MRPs never produce a mismatch by themselves, and a zero/invalid `agreedRate` is guarded against division by zero.

If there are multiple POs for one `poNumber` (`duplicate_po`), the **earliest-created** PO is the reference for all quantity/price comparisons — the extra one only contributes the `duplicate_po` flag; it is never blended into the totals, since that would make the comparison meaningless.

## Out-of-order handling

GRN and Invoice link to a PO by the `poNumber` **string**, not a Mongo foreign key — so a document is always storable regardless of upload order. This was verified directly: a GRN and an Invoice were uploaded for a `poNumber` with no PO yet, both persisted successfully, and `/match` correctly returned `insufficient_documents` rather than an error at every step, until the PO was uploaded last and the match recomputed correctly across all three.

## Duplicate handling

Duplication is a **live count**, not a stored flag: `duplicate_po` and `duplicate_document` are recomputed on every `/match` read by counting how many PO/GRN/Invoice documents currently exist for that key — consistent with "never return a stale cached result." This was proven with a genuine duplicate invoice upload during development (not staged), which persisted correctly and got flagged without blocking the second upload.

## Frontend architecture & state management

**TanStack Query** for all server state — chosen (per the assignment's own framing) because the backend is the source of truth and the app is almost entirely "fetch this, mutate that, refetch" with no meaningfully complex client-only state to justify a global store like Redux. Auth is the one piece of real client-side state (a token that must survive page reloads and isn't "server data" in the same sense), so it lives in a small `AuthProvider` context backed by `localStorage` — exactly the "small local store/context for UI state" the assignment suggests pairing with TanStack Query.

Layering, consistent across every resource: `lib/apiClient.js` (pure fetch wrapper, no React, aware of this backend's `{success, data, message, err}` envelope) → `lib/api/<resource>Api.js` (endpoint calls) → `hooks/use<Resource>.js` (query/mutation wiring + cache invalidation) → components. A `401` from any query or mutation is handled once, centrally, via TanStack Query's `QueryCache`/`MutationCache` global `onError` — clearing the stale token and redirecting to `/login` — rather than every hook needing to check for it.

Component grouping mirrors the domain, not just genericness: `components/ui` (generic primitives — `Button`, `Modal`, `Badge`...), `components/layout` (app shell), `components/matching` (the PO/Fulfillment/Delivery detail-view pieces, shared because those three tabs are structurally identical), `components/summary`, `components/skuMaster`. `DocumentDetailTab` is one component driving both the Fulfillment and Delivery tabs, since they differ only in field names and whether a unit price exists on that document type — building it twice would have been pure duplication.

File preview (`GET /documents/:id/file`) is protected like every other route, but a plain `<iframe src>`/`<img src>` can't attach an `Authorization` header — so the file is fetched as a blob (with the header) and turned into an object URL, cleaned up on unmount.

## Assumptions & deviations from the minimum spec

- **Auth**: the spec only requires `POST /auth/login` returning a static token. This backend instead implements full email/password signup + JWT auth. Not required, but already built before this was reconsidered, and left in as a more realistic implementation rather than torn out.
- **PO Amount / Total Received** (summary stat cards): neither `PurchaseOrder` nor `Grn` items carry a price field in the data model — only `SkuMaster.agreedRate`/`mrp` do. These two stats are `quantity × agreedRate` (contracted value); **Total Invoiced** uses the invoice's actual `unitRate` (real billed amount) — the only one of the three stats backed by a real, document-level price.
- Local disk storage for uploaded files (per the assignment's own stated assumption).
- `SkuMaster` resolution is the item-matching key, as the assignment suggests.

## Tradeoffs

- Master resolution re-runs live on every match read for unmapped items rather than being cached/written back — always fresh, at the cost of a few extra DB lookups per match. At this data scale that cost is negligible; it would need revisiting well before it became a bottleneck.
- The PO tab's `ItemGrid` (PO-wide aggregate, three quantity columns) and the Fulfillment/Delivery tabs' `DocumentItemGrid` (single document, real per-line values) are two separate components rather than one heavily-conditional one — more total files, but each one stays simple to read.
- Duplication is unbounded — a third, fourth, etc. upload of the same PO/GRN/invoice number all still just increment the count and stay flagged; there's no cap or special-casing beyond "more than one."

## Known limitations

- **Gemini extraction is not perfectly deterministic.** Re-parsing the *exact same* PO PDF a second time (to test `duplicate_po` detection) produced a different `poNumber` than the correct one — a value that doesn't appear anywhere in the source document's text (confirmed via `pdftotext`). Since duplicate detection keys on an exact `poNumber` match, this is a real, if rare, way a genuine duplicate could be missed. This is inherent to LLM-based extraction, not a bug in the duplication logic itself (which was separately verified correct with a genuine duplicate invoice).
- No pagination on document or SKU Master listings — fine at this data scale, would need it in production.
- No automated test suite. Verification throughout development was live and scripted (real uploads against real sample documents, driven in an actual headless browser with screenshots), not unit/integration tests committed to the repo.
- A pre-existing bug in `zodValidator.js` (not introduced by this work, never fixed): validation error responses return an empty `err: []` instead of the actual per-field messages.
- File preview zoom is a CSS `transform: scale()` over the browser's native PDF viewer / an `<img>` — "basic zoom" per the spec's own allowance, not a true PDF.js integration.
- No real upload progress (`uploading → parsing → mapping → matched`) — listed in the spec as an optional bonus, not built.

## What I'd improve with more time

- Pagination/infinite scroll for document and SKU Master lists
- Real upload progress reflecting actual backend pipeline state
- An automated test suite (the manual/scripted verification this session did was thorough but isn't committed, reusable regression coverage)
- Fix the pre-existing `zodValidator.js` empty-error-array bug
- A secondary, non-Gemini cross-check (or fuzzy match) for `poNumber` extraction specifically, given the demonstrated non-determinism
- Bulk SKU Master import (CSV)

## AI tools used

The entire implementation — backend, frontend, debugging, and this documentation — was built with **Claude (Sonnet 5) via Claude Code**, pair-programmed branch-by-branch with review and testing at each step rather than generated in one pass.
