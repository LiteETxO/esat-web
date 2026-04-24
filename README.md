# ESAT Web — Ethiopian Satellite Television & Radio

Rebuilt website for [ESAT](https://en.wikipedia.org/wiki/ESAT), the Ethiopian Satellite Television and Radio. Independent Ethiopian broadcasting since April 24, 2010.

## Stack

- **Next.js 16** (App Router, SSR/ISR)
- **TypeScript** strict mode
- **Tailwind CSS v4**
- **next-intl** — English (default at `/`), Amharic (`/am/`), Afaan Oromo (`/or/` scaffolded)
- **Sanity.io** — headless CMS, Studio at `/studio`
- **Vercel** — production deployment (TODO: configure project)

## Local setup

```bash
# 1. Clone
git clone https://github.com/LiteETxO/esat-web.git
cd esat-web

# 2. Install
npm install

# 3. Environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SANITY_PROJECT_ID at minimum

# 4. Dev server
npm run dev
# → http://localhost:3000        (English)
# → http://localhost:3000/am     (Amharic)
# → http://localhost:3000/studio (Sanity Studio)
```

## Environment variables

See `.env.example` for all required variables.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Sanity dataset (default: `production`) |
| `YOUTUBE_API_KEY` | M2+ | YouTube Data API v3 — episode pulls |
| `STRIPE_SECRET_KEY` | M3+ | Stripe payments |
| `STRIPE_WEBHOOK_SECRET` | M3+ | Stripe webhook signing |
| `RESEND_API_KEY` | M3+ | Newsletter (Resend) |
| `HCAPTCHA_SECRET` | M5 | hCaptcha — tip-line |
| `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` | M5 | hCaptcha — tip-line |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | M5 | Plausible analytics domain |

## Sanity CMS schemas

Studio at `/studio`. Schemas: `article`, `program`, `episode`, `author`, `category`, `liveEvent`, `donationTier`, `pressRelease`.

## Content rules

**Never fabricate Ethiopian news content.** Seed content only from:
1. YouTube Data API v3 (`@ESATtv` channel)
2. Wayback Machine archives of `ethsat.com` (2019–2020)

## Milestone status

- [x] M1 — Scaffold: stack, routes, fonts, theme, schemas
- [ ] M2 — Home page + routing skeleton (needs Vercel for ISR + live player)
- [ ] M3 — Article page + donate page
- [ ] M4 — Programs, live, radio
- [ ] M5 — Trust pages, SEO, security hardening
- [ ] M6 — Polish and handoff

## Deployment

**Current preview:** GitHub Pages (static, stubs only) — `liteetxo.github.io/esat-web/en/`

**Production:** Vercel required (ISR, server actions, YouTube API, Stripe webhooks).
TODO: Create Vercel project, link repo, add env vars, configure custom domain.
