# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
Empower website owners with a powerful, easy-to-integrate, and customizable chatbot that provides instant, accurate, and context-aware support to their users. By leveraging a sophisticated Retrieval-Augmented Generation (RAG) model (Google Gemini), the chatbot will answer user queries based on a custom knowledge base, enhancing engagement and reducing support burden.

## Goals
1. **Core Platform**: Build a multi-tenant SaaS dashboard for managing chatbots, knowledge bases, and subscriptions.
2. **RAG Engine**: Implement a robust ingestion pipeline using Gemini File Search and Firecrawl to create accurate knowledge bases from files and URLs.
3. **Embeddable Widget**: Develop a lightweight, performant, and customizable chat widget that works on any website.
4. **Human Handoff**: specific feature to allow seamless transition from AI to human agents.

## Non-Goals (Out of Scope for v1)
- Advanced Analytics Dashboard (Post-v1)
- Proactive Chat Triggers (Post-v1)
- CRM Integrations (HubSpot/Salesforce) (Post-v1)
- Data sources beyond PDF, TXT, and Web Crawl (e.g. Notion, Drive) (Post-v1)
- Data sources beyond PDF, TXT, and Web Crawl (e.g. Notion, Drive) (Post-v1)
- Multi-language auto-detection (Post-v1)

## Advanced Auth & Admin (Phase 6)
- **REQ-09: Advanced Auth**: Google Social Login, Remember Me, TOTP 2FA, Password Reset.
- **REQ-10: Admin Roles**:
    - **Super Admin**: (ThomasPerdana@gmail.com) Immutable, full access to all orgs/users.
    - **Admin**: Full access to own org features.
    - **Admin Dashboard**: Super admin interface to CRUD users.

## Users
- **Account Owners (Admins)**: SMBs, SaaS founders, Creators who set up the bot, manage subscriptions, and provide support.
- **End Users**: Visitors on the customers' websites interacting with the chatbot.
- **Support Agents**: Humans responding to handoff requests (often the same as Account Owners in v1).

## Constraints
- **Tech Stack**: Next.js (App Router), Supabase (Auth/DB/Realtime), Google Gemini API, Stripe, Firecrawl.
- **Performance**: Widget script < 100KB, AI Time-to-first-token < 2s.
- **Security**: Strict Row-Level Security (RLS) for multi-tenancy.
- **Deployment**: Vercel.

## Success Criteria
- [ ] User can sign up and create a chatbot organization.
- [ ] User can upload a PDF and crawl a URL, successfully indexing them into Gemini.
- [ ] Widget works when embedded on a verified external HTML page.
- [ ] Chatbot answers queries accurately based *only* on the provided knowledge interactions.
- [ ] "Talk to human" triggers a real-time alert/handoff state in the dashboard.
- [ ] Stripe subscription limits are enforced (e.g. message caps).
