# Solvevia

AI-powered invoice processing for accounting firms in the Gulf region.

## What it does

Solvevia ingests invoices (from Google Drive or direct upload), extracts
structured data using GPT-4o vision, applies UAE VAT / GCC tax classification,
and posts bills directly to QuickBooks Online — with no manual data entry.

## Who it's for

Accounting firms in the UAE and wider GCC managing high volumes of supplier
invoices across multiple clients.

## Core pipeline

```
Invoice (PDF/image)
  → GPT-4o extraction
  → UAE VAT / RCM classification
  → GL account mapping
  → QuickBooks Online bill posting
```

## Current status

The pipeline is live for our clients. The next phase is
turning this into a multi-tenant SaaS platform — any firm can sign up,
connect their QBO, and process invoices through a web dashboard.

## Tech stack

- **Backend:** Python / FastAPI
- **AI:** OpenAI GPT-4o (vision)
- **Accounting:** QuickBooks Online API
- **Drive ingestion:** Google Drive API
- **Audit log:** Google Sheets
- **Deployment:** Railway

## Developers

See `CLAUDE.md` for architecture details, conventions, and how to run locally.
