# Sample outputs

All three files are real responses pulled from the running backend against the actual sample PO (`CI4PO05788`, `assignment-detail/PO (1).pdf` + its GRN and Invoice) — nothing here is hand-written or fabricated.

- **`parsed-document.json`** — the unmodified Gemini output for the PO (`rawParsed`, via `GET /documents/:id`). This is exactly what's persisted alongside the structured fields, kept for debugging extraction issues without re-uploading.
- **`match-result.json`** — a full `GET /match/CI4PO05788` response. `linkedDocuments.{pos,grns,invoices}` each have their own `rawParsed` stripped here only for readability (it's identical in shape to `parsed-document.json` and would otherwise triple the file size); the real endpoint includes it in full. `filePath` values are redacted to `<uploads-dir>/...` — the real field is an absolute local filesystem path, irrelevant outside the machine that uploaded it.
- **`summary-result.json`** — a full `GET /summary/CI4PO05788` response.

This particular PO deliberately has real, uncurated messiness — 102 reconciled items, a genuine duplicate invoice, and several unresolved SKUs — since that's more useful as a sample than a hand-picked clean case.
