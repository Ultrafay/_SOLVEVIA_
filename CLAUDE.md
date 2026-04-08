# Solvevia — Project Context

## What we're building
Solvevia is a multi-tenant SaaS platform for accounting firms and finance teams worldwide. It ingests invoices from any source, extracts them with GPT-4o Vision, classifies them, applies the right tax treatment for the jurisdiction, and posts them to the accounting system. The full product spec lives in docs/PRD.md — read it before doing anything.

## Source of truth
docs/PRD.md is the source of truth. If code conflicts with the PRD, the PRD wins. If you think the PRD is wrong, surface it — don't silently deviate.

## Stack
- Backend: FastAPI (Python), Railway, Supabase/Postgres
- Frontend: Next.js 14 App Router, shadcn/ui, Zustand, Clerk auth
- AI: GPT-4o Vision
- Integrations: QuickBooks Online, Google Drive

## Non-negotiable rules
- **Tax logic is data, not code.** Never hardcode a tax code, rate, or jurisdiction rule in classification, extraction, or posting layers. The tax engine is the only place tax decisions are made.
- **Multi-tenancy is enforced at the query layer.** Every table has tenant_id, every query filters by it, no exceptions. Tenant isolation has tests.
- **Dynamic over hardcoded.** FX rates, tax rates, vendor data, GL accounts — all fetched, never baked in.
- **No single-tenant assumptions.** No hardcoded home currency, no default tax regime, no client-specific logic anywhere in the product layer.
- **QBO tokens:** _save_tokens must update os.environ directly, not just write .env. Single-quoted .env values cause silent auth failures on Railway.

## How I want you to work
- **Full autonomy:** plan, code, test, commit. Don't ask permission for each step.
- **Plan first:** for any milestone, write the plan to docs/milestones/<name>.md before touching code. I'll skim it.
- **Small commits, conventional messages, one feature per branch.**
- **Test what matters:** tenant isolation, tax engine correctness, posting paths. Skip trivial unit tests.
- **Stop and surface** on: PRD conflicts, multi-tenancy leaks, destructive migrations, QBO sandbox-vs-production ambiguity.

## Heritage code warning
This repo originated as a single-client invoice automation and went through partial refactoring toward multi-tenancy. Expect single-tenant assumptions, hardcoded values, and Gulf-specific tax logic baked into the existing code. Treat existing code as a quarry, not a foundation — keep what fits the PRD, refactor what's close, delete what doesn't belong.

## Brand
- Sidebar `#0F1117`, accent `#DEA653`, DM Sans / DM Mono.

## Communication
- Short, direct. "We" not "I". No filler.
