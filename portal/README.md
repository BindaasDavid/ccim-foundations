# Foundations portal

Private study workspace for the CCIM Foundations course. React and Vite, in this folder. GitHub Pages publishes the production build. It is a study tool and a reference for calculators, not a marketing site.

```bash
cd portal
npm install
npm run dev
```

**Listen** reads the study notes in `src/data/modules.ts` aloud in the browser. It does not load course-packet text.

Official course files stay in `../Support Materials` (gitignored). They may inform the calculators. Their text is not part of the public site.

The site sends `noindex, nofollow` and a `robots.txt` that disallows everything.
