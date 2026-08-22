# CLAUDE.md — VSC-website

**Purpose:** Marketing website for Veteran Service Connect.

- **Repo:** [vsc-enterprise-solutions/VSC-website](https://github.com/vsc-enterprise-solutions/VSC-website)
- **Canonical path:** `~/Projects/VSC-website` (also `~/Projects/vsc/website`)
- **Live:** https://veteranserviceconnect.com

## Tech stack
Static HTML/CSS/JS + Vercel serverless functions. **No build step, no framework.**

## Run / deploy
```bash
cd ~/Projects/VSC-website   # canonical path — not the symlink
npx vercel dev      # local
npx vercel --prod   # production deploy
```
Vercel project `vsc-website` (team `gmdeeses-projects`).

## Key files
| Path | What |
|---|---|
| `index.html` | Landing page |
| `delivery.html`, `apps.html`, `jira.html` | Service pages |
| `api/contact.js` | Contact form serverless function |
| `vercel.json` | `cleanUrls`, redirects, rewrites, security headers |
| `assets/`, `css/`, `js/` | Static assets |

`vercel.json` maps clean URLs (`/delivery` → `delivery.html`) and permanently redirects legacy paths (`/businessconsulting` → `/delivery`, `/mobileappdesign` → `/apps`, `/productivity` → `/delivery`). **Preserve those redirects** — they carry SEO value.

## Relationships
Sibling of **vsc/capacity-dash** under the same org. Independent of the Stillwater and Naera products.

## Rules
Follow `~/Projects/CLAUDE.md` §6. Do not edit `vercel.json` redirects/headers without an explicit request.
