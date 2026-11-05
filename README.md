# go.veraid.org · VeraID affiliate links

Public repo (GitHub Pages). Never put passwords, keys or personal data here.

- `go.veraid.org/CODE` records one click per phone, per affiliate, per day through the Supabase Edge Function `affiliate-click`, then opens the App Store (iPhone), Google Play (Android) or veraid.org (computer), with the code as the store campaign.
- Optional source tag: `go.veraid.org/CODE?s=instagram` (letters, numbers, `-`, `_`).
- Unknown or paused codes still redirect; they just aren't counted.
- New affiliate: `./new-affiliate.sh CODE`, commit, push. (`404.html` also handles any code, so a missing folder still works.)
- Shared logic: `go.js`. Page design: `_template.html`.
