# Videos

Two kinds of clip per featured project:

### 1. Card preview loops — `previewVideo` (home Work cards)
Short landing-page scroll-throughs that autoplay muted/looping on the card cover.
- `cryptai.mp4`   ✅
- `studyarc.mp4`  ✅ (dark mode)
- `klaro.mp4`     ✅
- MediQuick / TodoAI → none yet (cards show the poster image)

### 2. Case-study walkthroughs — `demoVideo` (play-to-watch on /projects/<slug>)
Full app walkthroughs (signup → dashboard etc.). Shown behind a play button.
- `studyarc-demo.mp4` ✅ — full onboarding → generated plan
- CryptAI → blocked (signup needs email confirmation)
- Klaro → blocked (frontend needs its Python/Postgres backend running)
- MediQuick / TodoAI → no local app to record

Field names live on each project in `src/data/content.json`
(`previewVideo` = card loop, `demoVideo` = case-study walkthrough).
