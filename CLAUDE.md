# CLAUDE.md — Solvevia Platform

This file is the source of truth for AI-assisted development on this repo.
Read it before touching any code.

---

## What is Solvevia?

Solvevia is a multi-tenant SaaS platform for AI-powered invoice processing,
targeting accounting firms in the Gulf region (UAE, KSA, and wider GCC).

The core value proposition: an accounting firm signs up, connects their
QuickBooks Online account, and their invoices are automatically extracted,
VAT-classified, and posted as bills — without manual data entry.

Think Dext / AutoEntry, but built specifically for Gulf tax rules (UAE VAT,
RCM, GCC Intra-GCC treatment).

**First live client:** Athgadlang (ATH) — the existing pipeline in this repo
was built for them and is in production.

---

## Current Architecture (Single-Tenant, ATH Pipeline)

```
Google Drive (invoices drop here)
        │
        ▼
DriveProcessor (workers/drive_processor.py)
  — polls Drive folder via Google Drive API
  — downloads new PDFs / images
        │
        ▼
OCR Engine (ocr_engine.py)
  — pdf2image + OpenCV preprocessing
  — Tesseract OCR fallback for scanned docs
        │
        ▼
OpenAI Extractor (services/openai_extractor.py)
  — GPT-4o vision: sends page images to OpenAI
  — returns structured InvoiceData (vendor, lines, amounts, tax codes)
        │
        ▼
VAT Processor (services/vat_processor.py)
  — determines supplier location: UAE / GCC / Foreign
  — validates and assigns per-line tax codes (SR / EX / ZR / RC / IG)
  — handles RCM / foreign tax distribution
  — flags mismatches for review
        │
        ▼
GL Classifier (services/gl_classifier.py)
  — maps line items to Chart of Accounts using gl_reference_data.py
        │
        ▼
QuickBooks Service (services/quickbooks.py)
  — OAuth 2.0 with auto-refresh on 401
  — fuzzy vendor matching + auto-creation
  — posts Bill via QBO REST API
        │
        ▼
Google Sheets (services/sheets_service.py)
  — audit log + status tracker for every invoice
```

**Web Layer:** FastAPI (app.py) — serves a static HTML dashboard,
exposes REST endpoints, handles QBO OAuth flow.

**Deployment:** Railway (Procfile + railway.json). Tokens are persisted
back to Railway environment variables via the Railway GraphQL API.

---

## Target Architecture (Multi-Tenant SaaS)

```
┌─────────────────────────────────────────────────────────────┐
│  Next.js Frontend (Vercel)                                  │
│  — Firm signup / login (Supabase Auth)                      │
│  — Per-firm dashboard: upload invoices, review, approve     │
│  — QBO connect flow per firm                                │
│  — Subscription billing (Stripe)                           │
└────────────────────┬────────────────────────────────────────┘
                     │ REST / tRPC
┌────────────────────▼────────────────────────────────────────┐
│  FastAPI Backend (Railway or Fly.io)                        │
│  — Multi-tenant middleware: every request scoped to firm_id │
│  — Wraps the existing ATH engine (no logic changes)         │
│  — Per-firm QBO credentials stored in Supabase (encrypted) │
│  — Per-firm Drive folder config                             │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│  Supabase (Postgres + Auth + Storage)                       │
│  — firms table (id, name, plan, qbo_realm_id, ...)         │
│  — invoices table (firm_id, status, extracted_data, ...)   │
│  — Supabase Auth for user sessions                         │
│  — Supabase Storage for uploaded invoice files             │
└─────────────────────────────────────────────────────────────┘
```

The existing pipeline (`ocr_engine.py`, `services/`, `workers/`) becomes
the processing engine called by the backend — it does not change structurally,
it just receives per-firm credentials instead of env vars.

---

## Key Conventions

### Language & Stack
- **Backend:** Python 3.11+, FastAPI, uvicorn
- **Frontend (SaaS phase):** Next.js (App Router), TypeScript, Tailwind CSS
- **Database (SaaS phase):** Supabase (Postgres)
- **AI extraction:** OpenAI GPT-4o vision — do not swap this out

### No Hardcoded Values
- All API credentials, tokens, folder IDs must come from environment
  variables or (in SaaS) from the database per firm.
- Never commit `.env` files or credentials to git.
- The QBO token write-back strategy: Railway env vars in production,
  `.env` file locally (handled automatically by `services/quickbooks.py`).

### Preserve the ATH Pipeline
- The current pipeline is live and billing a real client.
- Do not refactor `services/quickbooks.py`, `services/vat_processor.py`,
  `services/openai_extractor.py`, or `ocr_engine.py` unless explicitly
  asked. These modules work and have been tuned for Gulf invoices.

---

## DO NOT TOUCH Without Asking

| Area | Files | Why |
|---|---|---|
| QBO bill posting path | `services/quickbooks.py` | Live in production; any breakage stops ATH billing |
| GPT-4o extraction logic | `services/openai_extractor.py` | Prompt-tuned for Gulf invoices; changes affect accuracy |
| VAT / RCM logic | `services/vat_processor.py` | UAE tax compliance; errors = wrong tax treatment |
| Drive ingestion loop | `workers/drive_processor.py` | Polling logic handles deduplication + error recovery |

If you need to modify any of these, discuss the change first, make it
behind a feature flag or in a separate branch, and test against
`example/` sample invoices before merging.

---

## Running the Backend Locally

### Prerequisites
- Python 3.11+
- Tesseract OCR installed system-wide (`tesseract --version` should work)
- Poppler installed (for pdf2image: `pdftoppm -v` should work)
- A `.env` file in the repo root (copy from `.env.example` when created)

### Setup

```bash
# 1. Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Add your .env file (see required vars below)
cp .env.example .env   # then fill in values

# 4. Start the server
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Dashboard: http://localhost:8000/static/index.html
QBO connect: http://localhost:8000/auth/quickbooks/connect

### Required Environment Variables

```
# OpenAI
OPENAI_API_KEY=
OPENAI_ORG_ID=          # optional

# QuickBooks Online
QBO_CLIENT_ID=
QBO_CLIENT_SECRET=
QBO_REALM_ID=           # set after OAuth
QBO_ACCESS_TOKEN=       # set after OAuth
QBO_REFRESH_TOKEN=      # set after OAuth
QBO_ENVIRONMENT=sandbox # or production
QBO_REDIRECT_URI=http://localhost:8000/auth/quickbooks/callback

# Google Drive + Sheets
GOOGLE_DRIVE_FOLDER_ID=
GOOGLE_SHEETS_ID=
GOOGLE_CREDENTIALS_JSON=  # base64-encoded service account JSON

# Railway (production only — for token write-back)
RAILWAY_API_TOKEN=
RAILWAY_SERVICE_ID=
RAILWAY_PROJECT_ID=
RAILWAY_ENVIRONMENT_ID=
```

---

## Project Layout

```
solvevia-product/
├── app.py                  # FastAPI app, OAuth routes, REST endpoints
├── ocr_engine.py           # Pipeline orchestrator (init + process_invoice)
├── main.py                 # CLI entry point (batch mode)
├── constants.py            # Shared constants
├── extraction.py           # Legacy regex-based extraction (fallback)
├── tables.py               # Table detection/parsing helpers
├── preproces.py            # Image preprocessing before OCR
├── converter.py            # PDF→image conversion
├── run_ocr.py              # Tesseract wrapper
├── handler.py              # File routing helper
├── manual_extracter.py     # Manual override extraction
├── services/
│   ├── openai_extractor.py # GPT-4o vision extraction (primary path)
│   ├── quickbooks.py       # QBO OAuth + bill posting
│   ├── vat_processor.py    # UAE VAT / RCM / GCC tax logic
│   ├── gl_classifier.py    # Chart of Accounts mapping
│   ├── gl_reference_data.py# GL category reference data
│   ├── sheets_service.py   # Google Sheets audit log
│   ├── drive_watcher.py    # Google Drive polling
│   └── vat_processor.py    # VAT logic
├── workers/
│   └── drive_processor.py  # Async Drive ingestion worker
├── utils/
│   └── credentials_helper.py # Google credentials loading
├── static/
│   ├── index.html          # Single-page dashboard (current UI)
│   └── auth_success.html   # Post-OAuth success page
├── example/                # Sample invoices for testing
├── Dockerfile
├── Procfile                # Railway: uvicorn app:app --port $PORT
└── railway.json
```
