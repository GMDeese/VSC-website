# TEAM — VSC Navigation & Service Architecture Review
**Date:** 2026-05-24  
**Topic:** Nav restructure + service story cohesion  
**Participants:** Chesky, Ive, Schultz, Vogels, Karpathy

---

## Phase 1 — Evidence Base

**Files reviewed:**
- `index.html` — Homepage, hero stats, bento grid, process, contact
- `jira.html` — Jira consulting: environment audits, workflow design, Atlassian Gold Partner via implementation partners; Capacity Dashboard section commented out (not live)
- `businessconsulting.html` — E-2-E Technical Product Management: five stages (Discover → Define → Design & Validate → Build → Go-to-Market)
- `mobileappdesign.html` — App Design: Stillwater (iOS beta/TestFlight), Naera (live web app)
- `productivity.html` — GTM Engine: AI-powered pipeline (market research synthesis, content generation, outreach sequencing, attribution & analytics)

**Current nav:** `Jira | Consulting | App Design | Productivity | [Start a Project]`

**Buyer × Service Matrix:**

| Buyer | Their Problem | Service | Nav today | Findable? |
|---|---|---|---|---|
| PMO / Ops Lead | Jira is a mess | Jira optimization | Jira ✓ | Yes |
| IT Director | Need dashboards | Capacity Dashboard | Commented out | No |
| Dione / partner | Implementation + licensing | Jira (partner track) | Jira ✓ (buried) | Barely |
| Startup founder | Need an app built | App Design | App Design ✓ | Yes |
| Product leader | Need E-2-E delivery | E-2-E TPM | "Consulting" ✗ | Weak |
| Growth lead | Need GTM automated | GTM Engine | "Productivity" ✗ | No |

---

## Phase 2 — Principal Statements

### Brian Chesky — Product & Narrative

**Score: 3/5**  
**One-line verdict:** The nav lists services; it should tell a story about what kind of problems VSC solves.

The current nav is structured around what VSC does internally — consulting, productivity tools, app design. But buyers organize their decisions around their own pain, not a vendor's internal org chart. There are exactly three buyer types: someone whose Jira environment is broken, someone who needs E-2-E product delivery, and someone who wants a real app built. The nav needs to route each in under 3 seconds.

The GTM Engine needs a home in the E-2-E story, not its own tab. "Productivity" signals a horizontal tool — the GTM Engine is a capability VSC activates at the Ship phase of an E-2-E engagement. The Dione partnership should be surfaced explicitly on the Jira page with a named section: "VSC designs the workflow. Our implementation partners handle the build."

**My ask:**
1. Rename "Consulting" → "E-2-E Delivery" in nav
2. Remove "Productivity" from nav; fold GTM Engine into the delivery page under "Ship & Scale"
3. Rename `/businessconsulting` → `/delivery`
4. Add "Partnership Model" section to jira.html
5. Homepage bento tiles should map exactly to the three nav items

---

### Jony Ive — Interface & Craft

**Score: 3/5**  
**One-line verdict:** Five nav items including a CTA is one abstraction too many; the nav is asking the eye to make a decision the architecture hasn't resolved yet.

| Current | Problem | Proposed |
|---|---|---|
| Jira | Self-evident | Jira (keep) |
| Consulting | Process language, vague | E-2-E Delivery |
| App Design | Self-evident | App Design (keep) |
| Productivity | Category confusion | Remove (fold into delivery page) |

Four total items (three services + CTA) is the parsing threshold. Beyond four, a first-time visitor has to read each item rather than glancing at the shape of the business.

**My ask:** `Jira | E-2-E Delivery | App Design | [Start a Project]` — four items maximum.

---

### Howard Schultz — Growth & Monetization

**Score: 2/5**  
**One-line verdict:** "Productivity" is leaving real revenue on the table — the GTM Engine is VSC's most defensible differentiator and it's invisible to buyers.

Embedded in an E-2-E engagement, the GTM Engine is a close: "We deliver the product AND we run the first 90 days of your go-to-market automation." The buyer is already sold on VSC for delivery — now you're upselling a capability they didn't know they needed. That's how you get to higher ACV.

The Capacity Dashboard should be called out on the Jira page as a "coming soon" waitlist item — not hidden. It signals product thinking and starts building a list.

**Funnel analysis:**
- "Jira" → jira.html: strong routing ✓
- "Consulting" → businessconsulting.html: weak. "Business Consulting" is a commodity label. High bounce risk.
- "App Design" → mobileappdesign.html: clear, social proof strong ✓
- "Productivity" → productivity.html: broken routing. The GTM buyer doesn't connect "Productivity" to their need.

**My ask:**
1. Rename nav to "E-2-E Delivery" and URL to `/delivery`
2. GTM Engine as named section on delivery page with anchor `/delivery#gtm-engine`
3. 301 redirect from `/productivity` → `/delivery`
4. Restore Capacity Dashboard on jira.html as waitlist card

---

### Werner Vogels — Architecture & Reliability

**Score: 3/5**  
**One-line verdict:** URL structure and page identity are misaligned — fix the redirects before building more pages on top of it.

Current URLs encode internal VSC org chart language. Proposed mapping:

| Current URL | Proposed URL | Action |
|---|---|---|
| `/businessconsulting` | `/delivery` | 301 redirect |
| `/productivity` | `/delivery` (fold to #gtm-engine) | 301 redirect |
| `/jira` | `/jira` | Keep |
| `/mobileappdesign` | `/apps` (optional) | Optional 301 |

**vercel.json redirects to add:**
```json
{
  "redirects": [
    { "source": "/businessconsulting", "destination": "/delivery", "permanent": true },
    { "source": "/productivity", "destination": "/delivery", "permanent": true }
  ]
}
```

**My ask:** Redirects go into `vercel.json` FIRST, before renaming any pages. Otherwise existing inbound links become 404s.

---

### Andrej Karpathy — AI & Personalization

**Score: 3/5**  
**One-line verdict:** The GTM Engine is the only thing on this site that signals technical depth — it should lead the E-2-E story, not live on a standalone "tool" page.

The GTM Engine is currently positioned as something a client would "use" — SaaS product positioning. But VSC isn't selling the tool; VSC is selling an outcome. The reframe: "when we hit the Ship phase, we don't hand you a deck — we activate the engine. Here's what that looks like."

Add PostHog nav click instrumentation before the restructure ships so there's a before/after comparison. Track: `nav_click` with `link_label` + `destination`, `page_view` with `page_name`.

**My ask:**
1. GTM Engine as "Phase 5: Ship & Scale" section on delivery page — describe as internal system VSC activates, not a tool the client buys
2. 301 from `/productivity` preserves SEO value to `/delivery`
3. PostHog nav click tracking before launch

---

## Phase 3 — Cross-Principal Discussion

**Chesky:** The Dione partnership is a business development asset that's currently invisible. A named section on the Jira page — "VSC designs the workflow. Our implementation partner handles the build." — gives enterprise buyers a reason to choose VSC even if they already have a preferred Atlassian reseller.

**Schultz:** Aligned. The partnership model is inbound with no acquisition cost if surfaced correctly.

**Vogels:** Redirects go in `vercel.json` before we rename any pages. Five-minute fix — do it first.

**Karpathy:** PostHog nav click tracking before restructure goes live. We need a baseline to measure against.

**Ive:** *(on the nav label debate)* Three service items is the ceiling. Jira, E-2-E Delivery, App Design. Everything else lives on the pages.

**Chesky:** "E-2-E Delivery" vs "Product Delivery" — the former is more distinctive and already matches the page's own language.

**Schultz:** "E-2-E" might not match buyer search vocabulary. But Karpathy is right — the nav label doesn't need to be SEO-optimized. The page head does that. Use the distinctive term.

**Vogels:** Implementation order: (1) vercel.json redirects, (2) create delivery.html, (3) update nav in all five HTML files, (4) update homepage bento, (5) update footers.

*(consensus reached)*

---

## Phase 4 — Consolidated Output

### Proposed Navigation
```
Jira  |  E-2-E Delivery  |  App Design  |  [Start a Project]
```

### Service Page Architecture

| Page | URL | Contents | Target buyer |
|---|---|---|---|
| Jira & Operations | `/jira` | Optimization, workflow, dashboards, Partnership Model, Capacity Dashboard waitlist | PMO, Ops Lead, IT Director |
| E-2-E Delivery | `/delivery` | E-2-E framework + GTM Engine as Ship & Scale capability | Startup founder, Product leader, Growth lead |
| App Design | `/mobileappdesign` (or `/apps`) | Stillwater + Naera as proof, React Native/Next.js | Entrepreneur wanting an app built |

### Scorecard

| Principal | Score | One-liner |
|---|---|---|
| Chesky | 3/5 | The nav lists services — it should route buyers |
| Ive | 3/5 | Five items is one too many; three services + CTA is the ceiling |
| Schultz | 2/5 | GTM Engine is the best differentiator and it's orphaned on "Productivity" |
| Vogels | 3/5 | Fix the redirects before touching nav labels |
| Karpathy | 3/5 | The GTM Engine is proof of capability, not a product — reframe it |

### Prioritized Actions

**Ship first (infrastructure):**
1. Add 301 redirects to `vercel.json` — `/businessconsulting` → `/delivery`, `/productivity` → `/delivery`
2. Create `delivery.html` (copy/restructure businessconsulting.html + GTM Engine section)
3. Update nav in all 5 HTML files: "Consulting" → "E-2-E Delivery" → `/delivery`; remove "Productivity"
4. Update footers in all 5 HTML files

**Ship second (content):**
5. Add "Partnership Model" section to `jira.html`
6. Restore Capacity Dashboard on `jira.html` as waitlist card (uncomment + reframe)
7. Add GTM Engine section to `delivery.html` under "Ship & Scale" phase
8. Update homepage bento: 3 primary tiles + 1 GTM Engine proof tile

### Open Questions for Garrett
1. **"E-2-E Delivery" vs. "Product Delivery"** — which matches your buyers' vocabulary?
2. **What is the Dione partnership model exactly?** (co-sell / referral / VSC-on-SOW?) Determines how to frame it on the page.
3. **Capacity Dashboard waitlist form** — Typeform, mailto, or something else?
4. **App Design URL** — keep `/mobileappdesign` or rename to `/apps`?
5. **GTM Engine** — internal-use-only on engagements, or also available as a standalone service?
