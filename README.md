# Seston Posture App — GitHub Pages Deployment Guide

## Project Overview

A React + Three.js PWA with a high-poly anatomical 3D wireframe, posture scoring, device management, and standing/sitting pose modes. Built with Vite for fast development and optimized production builds.

---

## Prerequisites

- **Node.js** 18+ (check with `node -v`)
- **npm** 9+ (check with `npm -v`)
- **Git** installed and configured
- **GitHub account** with a repository created

---

## Quick Start (5 minutes)

### 1. Create a GitHub Repository

Go to [github.com/new](https://github.com/new) and create a new repo named `posture-app` (or any name you prefer). Leave it empty — don't add a README or .gitignore.

### 2. Update the Base Path

Open `vite.config.js` and change the `base` value to match your repo name:

```js
// If your repo is: github.com/your-username/posture-app
base: '/posture-app/',

// If your repo is: github.com/your-username/my-posture-tracker
base: '/my-posture-tracker/',

// If deploying to a custom domain or username.github.io repo:
base: '/',
```

### 3. Initialize and Push

Open a terminal in the project folder and run:

```bash
# Install dependencies
npm install

# Test locally first
npm run dev
# Opens at http://localhost:5173 — verify everything works, then Ctrl+C to stop

# Initialize git and push
git init
git add .
git commit -m "Initial commit — Seston posture app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/posture-app.git
git push -u origin main
```

### 4. Enable GitHub Pages

1. Go to your repo on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under **Build and deployment → Source**, select **GitHub Actions**
4. That's it — the included workflow file (`.github/workflows/deploy.yml`) handles the rest

### 5. Wait for Deployment

1. Go to the **Actions** tab in your repo
2. You should see a "Deploy to GitHub Pages" workflow running
3. Wait for it to complete (usually 1–2 minutes)
4. Your app will be live at:

```
https://YOUR-USERNAME.github.io/posture-app/
```

---

## Project Structure

```
posture-app/
├── .github/
│   └── workflows/
│       └── deploy.yml        ← GitHub Actions auto-deploy
├── src/
│   ├── main.jsx              ← React entry point
│   └── App.jsx               ← Full application (all components)
├── index.html                ← HTML shell with PWA meta tags
├── vite.config.js            ← Vite config with base path
├── package.json              ← Dependencies and scripts
└── .gitignore
```

---

## Available Commands

| Command           | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `npm install`     | Install all dependencies                                 |
| `npm run dev`     | Start local dev server (hot reload)                      |
| `npm run build`   | Production build → `dist/` folder                        |
| `npm run preview` | Preview the production build locally                     |
| `npm run deploy`  | Build + deploy via gh-pages package (alternative method) |

---

## Alternative: Manual Deploy with `gh-pages` Package

If you prefer not to use GitHub Actions, you can deploy manually:

```bash
# Make sure base path is set correctly in vite.config.js, then:
npm run deploy
```

This runs `vite build` then pushes the `dist/` folder to a `gh-pages` branch. For this method, set the Pages source to **Deploy from a branch** → `gh-pages` / `/ (root)` in your repo settings.

---

## Troubleshooting

### Blank page after deploy

- **Most common cause:** Wrong `base` in `vite.config.js`. It must match your repo name exactly, with leading and trailing slashes: `'/repo-name/'`
- Open browser DevTools → Console to check for 404 errors on JS/CSS files

### 404 on page refresh

Single-page apps need a fallback. Create a `public/404.html` that redirects to `index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <script>
      // Redirect 404s to the SPA
      const path = window.location.pathname;
      window.location.replace(window.location.origin + path);
    </script>
  </head>
</html>
```

### Three.js canvas is black / not rendering

- Check browser console for WebGL errors
- Ensure your browser supports WebGL2 (all modern browsers do)
- On mobile, the canvas might need a hard reload after first visit

### Build warnings about chunk size

The Three.js library is large (~690KB bundled). This is normal. To reduce it:

```js
// vite.config.js — split Three.js into its own chunk
export default defineConfig({
  plugins: [react()],
  base: "/posture-app/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
        },
      },
    },
  },
});
```

### Actions workflow fails

- Check the Actions tab for error logs
- Ensure your repo Settings → Pages → Source is set to **GitHub Actions**
- Verify `node-version: 20` in the workflow matches your local Node version

---

## Custom Domain (Optional)

1. In your repo, go to **Settings → Pages → Custom domain**
2. Enter your domain (e.g., `posture.yourdomain.com`)
3. Create a `public/CNAME` file with your domain:
   ```
   posture.yourdomain.com
   ```
4. Update `vite.config.js`:
   ```js
   base: '/',  // Root path for custom domains
   ```
5. Set up DNS: CNAME record pointing to `your-username.github.io`

---

## Updating the App

After making changes, simply push to `main`:

```bash
git add .
git commit -m "Your update description"
git push
```

GitHub Actions will automatically rebuild and redeploy within 1–2 minutes.
