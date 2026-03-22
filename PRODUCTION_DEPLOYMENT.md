# Kreatix9 Production Deployment Checklist

## Overview
This document outlines the steps to deploy Kreatix9 to production. The application has been configured to work correctly in both development and production environments.

---

## 1. Environment Variables Setup

### For Vercel Deployment:
1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables for **Production**, **Preview**, and **Development**:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.com` | Your production domain |
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB Atlas connection string |
| `NEXTAUTH_URL` | `https://your-domain.com` | Must match APP_URL |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | Generate with command |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Stripe live publishable key |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Stripe live secret key |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe webhook secret |
| `CLOUDINARY_CLOUD_NAME` | `your-cloud-name` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | `your-api-key` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | `your-api-secret` | Cloudinary API secret |

### For Custom Server (Railway, Render, etc.):
1. Copy `.env.production` to `.env.local`
2. Fill in all the values
3. Or set environment variables in your hosting dashboard

---

## 2. MongoDB Atlas Configuration

### Network Access:
1. Go to MongoDB Atlas → Security → Network Access
2. Click **Add IP Address**
3. Add `0.0.0.0/0` (allow all IPs) or add your server's IP
4. Save changes

### Database Access:
1. Go to Security → Database Access
2. Create a user with read/write permissions
3. Use that user's credentials in `MONGODB_URI`

---

## 3. Stripe Configuration

### Live API Keys:
1. Go to Stripe Dashboard → Developers → API keys
2. Copy the **live** publishable and secret keys
3. Add them to your environment variables

### Webhook Setup:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click **Add endpoint**
3. Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
4. Select events: `checkout.session.completed`, `payment_intent.payment_failed`
5. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

---

## 4. Cloudinary Configuration

1. Log in to Cloudinary
2. Go to Settings → API Keys
3. Copy your Cloud Name, API Key, and API Secret
4. Add to environment variables

---

## 5. Application URL

Update your environment variable:
```
NEXT_PUBLIC_APP_URL=https://your-actual-domain.com
NEXTAUTH_URL=https://your-actual-domain.com
```

**Important:** 
- Use HTTPS
- No trailing slash
- Must match your actual deployed URL

---

## 6. Deployment Platforms

### Option A: Vercel (Recommended)
```bash
npm i -g vercel
vercel
```
Or connect your GitHub repo to Vercel for automatic deployments.

**Note:** Socket.IO will gracefully degrade on Vercel (admin dashboard won't receive real-time updates). For full Socket.IO support, use a custom server.

### Option B: Custom Server (Full Socket.IO Support)
```bash
# Build the application
npm run build

# Start the server
npm start

# Or for development
npm run dev
```

### Option C: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 7. Troubleshooting Common Issues

### Issue: Authentication Not Working
- [ ] Check `NEXTAUTH_SECRET` is set (not the placeholder)
- [ ] Verify `NEXTAUTH_URL` matches your domain exactly
- [ ] Ensure cookies are not blocked by browser settings
- [ ] Check browser console for CORS errors

### Issue: Database Connection Failed
- [ ] Verify `MONGODB_URI` is correct
- [ ] Check MongoDB Atlas IP whitelist includes your server
- [ ] Ensure database user credentials are correct

### Issue: 500 Errors on API Routes
- [ ] Check server logs for specific errors
- [ ] Verify all environment variables are set
- [ ] Ensure Stripe/Cloudinary keys are live (not test) keys

### Issue: Images Not Loading
- [ ] Verify Cloudinary environment variables
- [ ] Check `next.config.mjs` image domains
- [ ] Ensure image URLs use HTTPS

### Issue: Socket.IO Not Working
- [ ] Socket.IO requires a custom server (won't work on Vercel serverless)
- [ ] Check server is running and accessible
- [ ] Verify firewall allows WebSocket connections

---

## 8. Post-Deployment Verification

Test these features on your live site:

- [ ] User registration and login
- [ ] Product browsing and search
- [ ] Add to cart functionality
- [ ] Checkout process with Stripe
- [ ] Order confirmation page
- [ ] Admin dashboard access
- [ ] Mobile responsiveness
- [ ] HTTPS certificate (green padlock)

---

## 9. Security Checklist

- [ ] Use strong `NEXTAUTH_SECRET` (min 32 characters)
- [ ] Enable HTTPS on your domain
- [ ] Use Stripe live keys (not test keys)
- [ ] Protect webhook endpoints
- [ ] Set appropriate CORS policies
- [ ] Enable database encryption at rest
- [ ] Use environment variables for all secrets
- [ ] Remove debug logs in production

---

## 10. Performance Optimization

- [ ] Enable gzip compression (Next.js does this by default)
- [ ] Configure CDN for static assets
- [ ] Enable browser caching headers
- [ ] Optimize images with Cloudinary
- [ ] Monitor Core Web Vitals

---

## Quick Commands

### Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Test MongoDB Connection:
```bash
mongosh "your-mongodb-uri"
```

### Check Environment Variables:
```bash
# Development
npm run dev

# Production
npm run build && npm start
```

---

## Support

If you encounter issues not covered here:
1. Check the browser console for errors
2. Check server logs
3. Verify all environment variables are set
4. Check the hosting platform's documentation
