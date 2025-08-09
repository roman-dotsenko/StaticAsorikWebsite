# AsorikWebsite

Simple static website.

## Manage content
- Edit `data/site.json` for site-wide info and home page content (title, subtitle, CTAs, competencies title, skills, email, year, author).
- Edit `data/projects.json` for the projects list.

## Run locally
Requires Node.js 18+.

```
node serve.js 5173
```

- Opens at http://localhost:5173/
- Pretty URLs supported: `/projects` resolves to `projects.html`.
- 404: serves `404.html` if present, else `error.html`.

## Deploy
- Any static host works (Azure Static Web Apps, Cloudflare Pages, GitHub Pages, Netlify, Vercel).
- Upload files as-is. Ensure JSON files are served (some hosts need correct MIME types which are already standard).

## Future backend
- You can replace JSON files with an API later without changing markup much; fetch URLs can be pointed to `/api/...`.
