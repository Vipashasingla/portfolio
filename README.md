# Vipasha — PM Portfolio

A self-contained static portfolio. No build step, no dependencies — just HTML
and CSS. Deploys anywhere.

## File structure

```
portfolio/
├── index.html              # homepage (hero, case studies, about, contact)
├── styles.css              # shared styles for the homepage
├── case-studies/
│   ├── daily-pulse.html    # your CWM / Daily Pulse case study (embedded)
│   └── nykaa-routine.html  # your Nykaa / Routine case study (embedded)
├── assets/                 # put images / your resume PDF here
├── netlify.toml            # optional Netlify config
└── README.md
```

## Before you deploy — quick edits

Open `index.html` and update:

1. **Your name** — appears in the top bar, the `<title>`, and the footer.
2. **Contact links** (footer) — email, LinkedIn, GitHub, resume PDF.
   For the resume, drop a PDF in `assets/` and link to `assets/resume.pdf`.
3. **Copy** — the hero, about, and case-study blurbs are written for you;
   tweak any wording that doesn't sound like you.

Your two case studies are already embedded in `case-studies/`. The homepage
preview images live in `assets/` (preview-cwm.png, preview-nykaa.png) — if you
edit a case study's opening screen, regenerate that screenshot to keep the card
in sync.

To add a third case study later: drop its `.html` in `case-studies/`, add a
preview image to `assets/`, and copy one of the `<a class="case">` blocks in
`index.html`, updating the link, image, and text.

## Deploy — Option A: Netlify (drag & drop, fastest)

1. Go to **app.netlify.com** → sign up free.
2. Drag the entire `portfolio` folder onto the deploy area.
3. Live in seconds at `your-name.netlify.app`.

## Deploy — Option B: Vercel (via GitHub, best for iterating)

1. Create a GitHub repo and push this folder:
   ```bash
   cd portfolio
   git init
   git add .
   git commit -m "Portfolio v1"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
   git push -u origin main
   ```
2. Go to **vercel.com** → sign up with GitHub → **Add New → Project**.
3. **Import** your repo. Framework preset: **Other** (it's plain static).
4. Click **Deploy**. Live at `your-project.vercel.app`.
5. Every future `git push` redeploys automatically.

## Custom domain (later)

Buy a domain (~$10/yr from Cloudflare, Namecheap, or Porkbun), then add it in
your host's dashboard:
- **Vercel:** Project → Settings → Domains → add your domain → follow DNS steps.
- **Netlify:** Site → Domain management → add custom domain.

You don't need this to start sharing — the free subdomain works for recruiters.
