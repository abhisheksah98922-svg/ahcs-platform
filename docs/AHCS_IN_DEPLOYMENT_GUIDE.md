# AHCS.IN Domain & Production Publishing Guide

Congratulations on acquiring **ahcs.in**! The application has been fully configured and optimized for `https://ahcs.in`.

---

## 1. What Has Been Prepared in the Codebase

1. **Production Environment (`.env.production`)**:
   - Set `NEXT_PUBLIC_APP_URL="https://ahcs.in"`.
2. **SEO & Metadata (`app/layout.tsx`)**:
   - Canonical URL set to `https://ahcs.in`.
   - OpenGraph & Twitter cards pre-configured with `ahcs.in`.
3. **Automated Sitemap (`app/sitemap.ts`)**:
   - Available at `https://ahcs.in/sitemap.xml`.
4. **Search Engine Crawling (`app/robots.ts`)**:
   - Protects private routes (`/officer`, `/provider/portal`, `/api`) while indexing public pages.
5. **Strict Security Headers (`next.config.mjs`)**:
   - HSTS (`Strict-Transport-Security`), `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy`.
6. **Deployment Configurations Ready**:
   - Vercel: `vercel.json`
   - Docker: `Dockerfile` & `docker-compose.yml`
   - Nginx Reverse Proxy with SSL: `nginx/ahcs.in.conf`

---

## 2. Option A: Vercel Deployment (Fastest & Zero Server Management)

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Configure production deployment for ahcs.in"
git push origin main
```

### Step 2: Import into Vercel
1. Login to [Vercel](https://vercel.com).
2. Click **"Add New..."** $\rightarrow$ **"Project"**.
3. Select your GitHub repository (`ahcs-platform`).
4. Click **"Deploy"**.

### Step 3: Connect Domain `ahcs.in`
1. Go to your Project Settings $\rightarrow$ **Domains**.
2. Add `ahcs.in` and `www.ahcs.in`.
3. Go to where you purchased `ahcs.in` (GoDaddy, Namecheap, Hostinger, Cloudflare) and set your DNS:
   - **Type `A`**: Name: `@` $\rightarrow$ Value: `76.76.21.21`
   - **Type `CNAME`**: Name: `www` $\rightarrow$ Value: `cname.vercel-dns.com`
4. Free SSL will be automatically provisioned within a few minutes!

---

## 3. Option B: VPS / Cloud Server (Hostinger, AWS, DigitalOcean, Hetzner)

### Step 1: Set DNS Records at your Domain Registrar
- **Type `A`**: Name: `@` $\rightarrow$ Value: `<YOUR_SERVER_IP>`
- **Type `CNAME`**: Name: `www` $\rightarrow$ Value: `ahcs.in`

### Step 2: Deploy with Docker Compose
On your server:
```bash
git clone <your-repo-url>
cd <repo-folder>
docker compose up -d --build
```

### Step 3: Enable Nginx & SSL (Let's Encrypt)
```bash
# Copy Nginx configuration
sudo cp nginx/ahcs.in.conf /etc/nginx/sites-available/ahcs.in
sudo ln -s /etc/nginx/sites-available/ahcs.in /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Install free SSL certificate
sudo certbot --nginx -d ahcs.in -d www.ahcs.in
```

---

## 4. Live Verification Checklist
Once your domain DNS propagates (usually 5 to 30 minutes):
- Open `https://ahcs.in` $\rightarrow$ Verify Homepage loads with HTTPS.
- Open `https://ahcs.in/sitemap.xml` $\rightarrow$ Verify XML sitemap.
- Open `https://ahcs.in/robots.txt` $\rightarrow$ Verify robots directives.
- Open `https://ahcs.in/officer/login` $\rightarrow$ Official Govt Verification Portal.
- Open `https://ahcs.in/provider/login` $\rightarrow$ Doctor & Staff Portal.
- Open `https://ahcs.in/provider/register` $\rightarrow$ Facility & Clinic Onboarding.
