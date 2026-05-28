# Junaid Khan — Portfolio v3

Data Analyst portfolio built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, and Recharts.

## 🚀 Deploy to Vercel (3 steps)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Click Deploy — done ✅

No env variables needed. Vercel auto-detects Next.js.

## 💻 Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Structure

```
app/          → Next.js pages, layout, API routes, globals.css
components/   → All section components (Hero, About, Skills, etc.)
data/         → Project data (projects.ts)
lib/          → SQL/Python mock output data
public/       → Static assets (profile photo, cv.pdf)
```

## 🔄 Auto-Update Features

- **KPIs, Projects, Skills** → Auto-fetch from GitHub API on page load
- **CV Download** → Put `cv.pdf` in `/public/` folder
- **Certificates** → Add image URLs to Misc.tsx certifications array
