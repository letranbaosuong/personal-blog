# Deployment Guide

Complete guide to deploying your Personal Blog & Portfolio website to production.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Deploy to Vercel](#deploy-to-vercel)
3. [Deploy to Netlify](#deploy-to-netlify)
4. [Custom Domain Setup](#custom-domain-setup)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment Tasks](#post-deployment-tasks)
7. [Continuous Deployment](#continuous-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying, ensure:

### Code Quality
- [ ] All tests pass: `npm run test`
- [ ] Build succeeds locally: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] No ESLint errors: `npm run lint`
- [ ] Code is committed to Git

### Content
- [ ] Firebase is set up and configured
- [ ] Environment variables are ready
- [ ] Site configuration is updated (`lib/constants/index.ts`)
- [ ] Personal information is added
- [ ] Sample content is removed or replaced

### Performance
- [ ] Images are optimized
- [ ] Large dependencies are code-split
- [ ] Bundle size is acceptable
- [ ] Lighthouse score is good (run locally)

### SEO
- [ ] Metadata is configured for all pages
- [ ] OG images are added
- [ ] Sitemap is configured (optional)
- [ ] Robots.txt is configured (optional)

---

## Deploy to Vercel

Vercel is the recommended platform for Next.js applications.

### Method 1: Deploy via GitHub (Recommended)

#### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create repository on GitHub
# Then add remote and push
git remote add origin https://github.com/yourusername/personal-blog.git
git branch -M main
git push -u origin main
```

#### Step 2: Import to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." > "Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Add environment variables (see [Environment Variables](#environment-variables))
7. Click "Deploy"

#### Step 3: Wait for Deployment

- Vercel will build and deploy your app
- You'll get a URL like `your-project.vercel.app`
- Subsequent pushes to `main` branch will auto-deploy

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow the prompts
# - Set up and deploy: Y
# - Which scope: Select your account
# - Link to existing project: N
# - Project name: personal-blog
# - Directory: ./
# - Build settings: Use default

# Deploy to production
vercel --prod
```

---

## Deploy to Netlify

### Method 1: Deploy via GitHub

#### Step 1: Push to GitHub

Same as Vercel - push your code to GitHub.

#### Step 2: Import to Netlify

1. Go to [Netlify](https://netlify.com)
2. Sign in with GitHub
3. Click "Add new site" > "Import an existing project"
4. Choose GitHub and authorize
5. Select your repository
6. Configure build settings:
   - **Base directory**: (leave empty)
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
7. Add environment variables
8. Click "Deploy site"

### Method 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Method 3: Manual Drag and Drop

1. Build locally: `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag and drop the `.next` folder
4. Site will be live instantly

---

## Custom Domain Setup

### For Vercel

#### Step 1: Add Domain

1. Go to your project on Vercel
2. Click "Settings" > "Domains"
3. Enter your domain (e.g., `yourdomain.com`)
4. Click "Add"

#### Step 2: Configure DNS

Vercel will show you DNS records to add:

**Option A: Using Vercel Nameservers (Recommended)**
1. Copy the nameservers provided
2. Go to your domain registrar
3. Update nameservers to Vercel's nameservers
4. Wait for DNS propagation (can take 24-48 hours)

**Option B: Using CNAME Record**
1. Add a CNAME record:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `cname.vercel-dns.com`
2. For apex domain, use A record:
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21`

#### Step 3: SSL Certificate

- Vercel automatically provisions SSL certificate
- Your site will be available at `https://yourdomain.com`

### For Netlify

#### Step 1: Add Domain

1. Go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain
4. Click "Verify"

#### Step 2: Configure DNS

**Option A: Netlify DNS**
1. Click "Set up Netlify DNS"
2. Follow the wizard
3. Update nameservers at your registrar

**Option B: External DNS**
1. Add CNAME record:
   - Name: `www` or `@`
   - Value: Your Netlify URL
2. For apex domain, use A record:
   - Value provided by Netlify

#### Step 3: SSL

- Netlify automatically provisions Let's Encrypt SSL
- Enable HTTPS in domain settings

### Update Environment Variables

After setting up custom domain:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

Redeploy after changing environment variables.

---

## Environment Variables

### Required Variables

Add these environment variables in your deployment platform:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Adding Variables in Vercel

1. Go to Project Settings
2. Click "Environment Variables"
3. Add each variable:
   - Key: Variable name
   - Value: Variable value
   - Environment: Production, Preview, Development
4. Click "Save"
5. Redeploy to apply changes

### Adding Variables in Netlify

1. Go to Site settings
2. Click "Environment variables"
3. Click "Add a variable"
4. Enter key and value
5. Save
6. Redeploy

---

## Post-Deployment Tasks

### 1. Test the Live Site

- [ ] Homepage loads correctly
- [ ] All pages are accessible
- [ ] Navigation works
- [ ] Dark/Light mode toggle works
- [ ] Blog posts display correctly
- [ ] Projects page shows data
- [ ] Contact information is correct
- [ ] Firebase connection works
- [ ] Images load properly
- [ ] Mobile responsive
- [ ] Forms work (if any)

### 2. SEO Setup

#### Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (domain or URL prefix)
3. Verify ownership (via DNS or HTML file)
4. Submit sitemap (if you created one)

#### Google Analytics (Optional)

1. Create Google Analytics account
2. Add tracking code to your site
3. Verify data is being collected

### 3. Performance Testing

Run performance tests:
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)

Target scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

### 4. Security Headers

Add security headers in `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};
```

### 5. Set Up Monitoring

#### Vercel Analytics (Built-in)

1. Go to your project
2. Click "Analytics" tab
3. View performance metrics

#### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

---

## Continuous Deployment

### Automatic Deployments

Both Vercel and Netlify support automatic deployments:

- **Production**: Deployments from `main` branch
- **Preview**: Deployments from pull requests
- **Development**: Manual deployments

### Deployment Workflow

```bash
# Development
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Create Pull Request on GitHub
# Preview deployment is automatically created
# Review changes on preview URL

# After review, merge to main
# Production deployment is automatically triggered
```

### Branch Configuration

**Vercel**:
1. Go to Settings > Git
2. Configure production branch: `main`
3. Enable preview deployments for all branches

**Netlify**:
1. Go to Site settings > Build & deploy
2. Set production branch: `main`
3. Enable deploy previews

---

## Troubleshooting

### Build Fails

**Check build logs**:
- Look for TypeScript errors
- Check for missing environment variables
- Verify all dependencies are installed

**Common fixes**:
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding/changing variables
- Check variable names for typos
- Verify values are correct

### Images Not Loading

- Check image paths are correct
- Verify Firebase Storage rules
- Check CORS configuration
- Use Next.js Image component

### Firebase Connection Issues

- Verify all Firebase environment variables
- Check Firebase project is active
- Review Firebase security rules
- Check billing status

### Domain Not Working

- Wait for DNS propagation (24-48 hours)
- Verify DNS records are correct
- Check domain registrar settings
- Clear browser cache

### Performance Issues

- Optimize images
- Enable compression
- Use code splitting
- Check bundle size
- Review database queries

---

## Rollback Strategy

### Vercel

1. Go to "Deployments" tab
2. Find previous successful deployment
3. Click three dots menu
4. Click "Promote to Production"

### Netlify

1. Go to "Deploys" tab
2. Find previous deployment
3. Click "Publish deploy"

### Manual Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push -f origin main
```

---

## Scaling and Optimization

### CDN and Caching

- Both Vercel and Netlify have built-in CDN
- Cache static assets automatically
- Configure cache headers as needed

### Database Optimization

- Add indexes to Firestore queries
- Use pagination for large datasets
- Implement caching strategies
- Monitor Firebase usage

### Image Optimization

- Use Next.js Image component
- Compress images before upload
- Use WebP format
- Implement lazy loading

---

## Maintenance

### Regular Tasks

**Weekly**:
- Check error logs
- Monitor performance metrics
- Review Firebase usage

**Monthly**:
- Update dependencies
- Review security alerts
- Check disk space (if applicable)
- Backup Firestore data

**Quarterly**:
- Security audit
- Performance optimization
- Content review
- Update documentation

---

## Cost Monitoring

### Vercel Pricing

- **Hobby**: Free (personal projects)
- **Pro**: $20/month (commercial)
- Monitor bandwidth and build minutes

### Netlify Pricing

- **Starter**: Free (personal)
- **Pro**: $19/month (commercial)
- Monitor bandwidth and build minutes

### Firebase Pricing

- **Spark**: Free tier
  - 1GB storage
  - 10GB bandwidth/month
  - 50K reads/day
- **Blaze**: Pay as you go
  - Set billing alerts
  - Monitor usage dashboard

---

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

---

**Congratulations on deploying your website!**
