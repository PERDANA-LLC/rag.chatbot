# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v1.0

## Must-Haves (from SPEC)
- [ ] Multi-tenant Authentication & Data Isolation
- [ ] Knowledge Base Ingestion (File + Web)
- [ ] RAG Chat Pipeline with Citations
- [ ] Embeddable Widget Component
- [ ] Human Handoff Workflow
- [ ] Stripe Subscription Gating

## Phases

### Phase 1: Foundation & Authentication
**Status**: ✅ Done
**Objective**: Set up the Next.js Supabase project with secure multi-tenancy and basic dashboard layout.
**Requirements**: REQ-01

### Phase 2: RAG Engine & Knowledge Base
**Status**: ✅ Done
**Objective**: Implement file upload, web crawling (Firecrawl), and Gemini indexing/retrieval pipeline.
**Requirements**: REQ-03, REQ-05

### Phase 3: The Embeddable Widget
**Status**: ✅ Done
**Objective**: Build the standalone chat widget, generating embed codes, and enabling end-user chat APIs.
**Requirements**: REQ-04, REQ-06, REQ-02 (Config)

### Phase 4: Human Handoff & Realtime
**Status**: ✅ Done
**Objective**: Implement the Agent Dashboard for live support and the logic to switch conversation modes.
**Requirements**: REQ-07

### Phase 5: Monetization & Launch
**Status**: 🏗️ In Progress
**Objective**: Integrate Stripe for subscriptions and enforce usage limits. Final polish.
**Requirements**: REQ-08
