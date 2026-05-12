# Loop

Loop is a private social planning board for friend groups. It sits between a WhatsApp group and Google Calendar: friends can discover London events, pin ideas, vote on interest, discuss options, and move the strongest plans toward confirmation.

## Current MVP

This branch contains a deployable Next.js prototype with:

- Luma-inspired landing/dashboard UI
- Private group framing for a London friend group
- Event cards with Interested / Let's Talk / Decline reactions
- Group signal badges such as Strong interest and Needs discussion
- Static event discovery form for category, date/week, budget, and London area
- One-click pinning from discovery into the group board
- Timeline view for week-level planning
- Decision board: Pinned, Discussing, Likely, Confirmed
- GitHub Pages static export configuration

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Deploy to GitHub Pages

This project is configured for GitHub Pages at:

```text
https://bt3113.github.io/loop/
```

Deployment runs from `.github/workflows/deploy-pages.yml` on pushes to `main`.

After merging the MVP PR into `main`, go to GitHub repository settings and make sure Pages is set to deploy from **GitHub Actions** rather than a branch folder.

## Product direction

The core product principle is: Google Calendar is useful after a plan is confirmed; Loop should own the messy pre-calendar stage.

Loop should answer:

- What should we do?
- Who is actually interested?
- Which ideas need discussion?
- What did we already reject?
- Which plan is strong enough to confirm?

## Next implementation milestones

1. Add Google OAuth.
2. Add persistent database tables for users, groups, events, reactions, comments, and pins.
3. Add invite links for friend groups.
4. Replace the static discovery catalogue with real event-source adapters.
5. Add OpenAI ranking/summarisation for discovered events.
6. Add Google Calendar sync for confirmed plans.
7. Add WhatsApp share links and notifications.

## Suggested integrations

- Google OAuth for identity
- Supabase Postgres for persistence
- Ticketmaster / PredictHQ / Eventbrite / Skiddle-style adapters for event discovery
- OpenAI API for result normalisation, ranking, summarisation, and duplicate detection
- Google Calendar API for confirmed-event sync
