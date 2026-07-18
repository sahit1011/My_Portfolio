# Videos

Two kinds of clip per featured project (fields in `src/data/content.json`):

### `previewVideo` — card cover loops (home Work cards)
Landing-page scroll-throughs, autoplay muted/looping on the card.
- `cryptai.mp4` ✅ · `studyarc.mp4` ✅ (dark) · `klaro.mp4` ✅
- MediQuick / TodoAI → none (cards show the poster image)

### `demoVideo` — case-study walkthroughs (play-to-watch on /projects/<slug>)
Full app tours behind a play button.
- `studyarc-demo.mp4` ✅ — full tour: landing → onboarding → generated plan →
  dashboard → Calendar → AI Tutor → My Notes → Progress (dark)
- `klaro-demo.mp4` ✅ — upload CSV → AI profile → AI training setup → Models → History
- CryptAI → blocked (signup needs email confirmation); live link points to
  https://cryptai.vercel.app instead
- MediQuick / TodoAI → no local app to record

Regenerate by re-running the recorders in the session scratchpad against the
running apps (StudyArc live; CryptAI :3011; Klaro frontend :3002 + backend :8001).
