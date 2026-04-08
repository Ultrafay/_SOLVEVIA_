# Solvevia — Project Context

## What we're building
Solvevia is a multi-tenant SaaS platform for accounting firms and finance teams worldwide. It ingests invoices from any source, extracts them with GPT-4o Vision, classifies them, applies the right tax treatment for the jurisdiction, and posts them to the accounting system. The full product spec lives in docs/PRD.md — read it before doing anything.

## Source of truth
docs/PRD.md is the source of truth. If code conflicts with the PRD, the PRD wins. If you think the PRD is wrong, surface it — don't silently deviate.

## Origin of this codebase
This repo started as a single-client invoice automation for Athgadlang (a Dubai accounting firm) on QuickBooks Online. It then went through five "sessions" of refactoring toward a multi-tenant SaaS, but that work assumed Gulf-only scope. The PRD now requires global multi-region from day one. Expect Gulf assumptions baked into the existing code that need to come out.

## Stack
- Backend: FastAPI (Python), Railway, Supabase/Postgres
- Frontend: Next.js 14 App Router, shadcn/ui, Zustand, Clerk auth
- AI: GPT-4o Vision
- Integrations: QuickBooks Online, Google Drive
- Live deployment: https://web-production-99a01.up.railway.app (Athgadlang pipeline still runs here)

## Non-negotiable rules
- **Tax logic is data, not code.** Never hardcode a tax code, rate, or jurisdiction rule in classification, extraction, or posting layers. The tax engine is the only place tax decisions are made.
- **Multi-tenancy is enforced at the query layer.** Every table has tenant_id, every query filters by it, no exceptions. Tenant isolation has tests.
- **Dynamic over hardcoded.** FX rates, tax rates, vendor data, GL accounts — all fetched, never baked in.
- **No Gulf-only assumptions.** AED is not the home currency. UAE VAT is not the default tax regime. Athgadlang is tenant #1, not the product.
- **QBO tokens:** _save_tokens must update os.environ directly, not just write .env. Single-quoted .env values cause silent auth failures on Railway.

## How I want you to work
- **Full autonomy:** plan, code, test, commit. Don't ask permission for each step.
- **Plan first:** for any milestone, write the plan to docs/sessions/<milestone>.md before touching code. I'll skim it.
- **Small commits, conventional messages, one feature per branch.**
- **Test what matters:** tenant isolation, tax engine correctness, posting paths. Skip trivial unit tests.
- **Stop and surface** on: PRD conflicts, multi-tenancy leaks, destructive migrations, QBO sandbox-vs-production ambiguity.

## Brand
- Sidebar `#0F1117`, accent `#F5C518`, DM Sans / DM Mono.

## Communication
- Short, direct. "We" not "I". No filler.
