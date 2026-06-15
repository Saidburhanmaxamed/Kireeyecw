# Somali Real Estate (SRE) - Netlify Deployment Guide

This application is fully optimized for hosting and seamless operation on **Netlify**. It features a modern SPA (Single Page Application) state architecture, custom typography scaling, and Somali language translation options.

## Netlify Optimization Files Added

To ensure that the app builds smoothly and performs with maximum reliability on Netlify, the following standard configuration files have been implemented under the hood:

### 1. `netlify.toml`
Located in the project root, this file instructs Netlify's build bots exactly how to handle the project build sequence:
- **Build Settings:** Sets the build script to `npm run build` and designates `dist` as the build output publish folder.
- **SPA Fallback Routing:** Defines a redirect rule (`/*` to `/index.html`) so that if deep-linking is used or a reader hard-refreshes a page, Netlify redirects to the entry index page safely to prevent any browser mock 404 errors.
- **Security Headers:** Restricts embedded frames, implements cross-origin headers, and enables browser-level XSS protection.

### 2. `public/_redirects`
Vite copies any static asset from the `/public` directory straight into the final `/dist` output folder. By introducing `_redirects` here, we guarantee redundancy so that Netlify continues to route URLs correctly even if custom deploy strategies are chosen.

---

## How to Deploy to Netlify

You can easily launch this property portal live using any of these simple methods:

### Option A: Connected Git Repository (Recommended)
1. Push this codebase to **GitHub**, **GitLab**, or **Bitbucket**.
2. Log into your [Netlify Dashboard](https://app.netlify.com/).
3. Click on **Add new site** -> **Import an existing project**.
4. Select your repository. Netlify will automatically detect the settings in `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**! Subsequent commits to your repository will auto-deploy the site instantly.

### Option B: Local Direct Drag-and-Drop (Netlify Drop)
1. Compile the production bundle locally by running:
   ```bash
   npm run build
   ```
2. Once complete, locate the freshly created `/dist` folder in the root directory.
3. Head over to [Netlify Drop](https://app.netlify.com/drop).
4. Direct drag-and-drop the `/dist` folder onto the web frame. Your site will instantly go live with a custom shareable URL!

### Option C: Netlify CLI
1. Install Netlify's command-line tools:
   ```bash
   npm install -g netlify-cli
   ```
2. Log in and initiate deployment directly:
   ```bash
   netlify login
   netlify init
   netlify deploy --prod
   ```

---

## Active Development Commands

- `npm run dev`: Boots up the local Vite-powered real-time dev environment on port `3000`.
- `npm run build`: Bundles full production static assets into `/dist` output directory.
- `npm run lint`: Code quality review check.
