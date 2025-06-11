# 🚀 Amplify Deployment Fix Guide

## Problem Solved: 404 Error on Amplify

The 404 error was caused by Next.js App Router not being properly configured for static hosting on AWS Amplify. I've fixed this by:

### ✅ **Changes Made:**

1. **Updated `next.config.js`** - Added static export configuration
2. **Updated `amplify-frontend.yml`** - Changed artifacts to use `out` directory
3. **Converted all scripts to use Yarn** instead of npm

### 🔧 **Current Configuration:**

#### `packages/frontend/next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  output: "export", // Enable static export
  images: {
    unoptimized: true, // Required for static export
  },
  basePath: "",
  experimental: {
    esmExternals: true,
  },
};
```

#### `amplify-frontend.yml`

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd packages/frontend
        - yarn install
    build:
      commands:
        - cd packages/frontend
        - yarn build
  artifacts:
    baseDirectory: packages/frontend/out # Static export output
    files:
      - "**/*"
```

### 🚀 **Deployment Steps:**

1. **Commit and push your changes:**

   ```bash
   git add .
   git commit -m "Fix: Configure Next.js static export for Amplify"
   git push origin main
   ```

2. **In AWS Amplify Console:**

   - Go to your frontend app
   - Click "Redeploy this version" or wait for auto-deployment
   - The build should now succeed and serve static files correctly

3. **Verify the build:**
   - Check build logs for successful static export
   - Look for "out" directory in artifacts
   - Test the deployed URL

### 📊 **Build Output Expected:**

```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (4/4)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    28.7 kB         135 kB
└ ○ /_not-found                          873 B          88.1 kB
```

### 🔍 **Troubleshooting Commands:**

Test locally before deploying:

```bash
# Test the build process
cd packages/frontend
yarn build

# Check if out directory is created
ls -la out/

# Verify index.html exists
cat out/index.html | head -10
```

### 🌐 **Environment Variables:**

Make sure these are set in your Amplify Console:

**Frontend App:**

- `NEXT_PUBLIC_API_URL`: Your backend API URL
- `NODE_ENV`: production

**Backend App:**

- `DATABASE_URL`: Your RDS connection string
- `CORS_ORIGIN`: Your frontend domain
- `NODE_ENV`: production
- `PORT`: 4000

### 🎯 **What Fixed the 404:**

1. **Static Export**: Next.js now generates static HTML/JS files in `out/` directory
2. **Proper Artifacts**: Amplify now serves from the correct directory structure
3. **Image Optimization**: Disabled for static hosting compatibility
4. **Build Process**: Simplified to work with Amplify's static hosting

### 🔄 **If You Still Get 404:**

1. **Check Amplify Build Logs:**

   - Ensure `out` directory is created
   - Verify artifacts are properly copied

2. **Clear Cache:**

   - In Amplify Console → Build settings → Clear cache
   - Redeploy

3. **Verify Domain:**
   - Check if you're accessing the correct Amplify domain
   - Look for any custom domain configuration issues

### 🚀 **Next Steps:**

1. Deploy and test the frontend
2. Set up your backend database using: `./scripts/setup-database.sh`
3. Deploy the backend service
4. Update environment variables with actual URLs
5. Test the full application flow

Your application should now deploy successfully without 404 errors! 🎉
