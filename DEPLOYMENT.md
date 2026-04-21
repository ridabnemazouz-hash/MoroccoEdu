# MoroccoEdu Platform - Deployment Guide

## Production Deployment Checklist

### 1. Environment Setup

```bash
# Copy and configure environment variables
cp .env.example .env

# Edit .env with production values:
# - Set NODE_ENV=production
# - Use strong JWT_SECRET (64+ characters)
# - Use different JWT_REFRESH_SECRET
# - Set database credentials
# - Configure Redis URL
# - Set Cloudinary credentials
# - Configure allowed origins for CORS
```

### 2. Database Setup

```bash
# Run database migrations
npm run db:migrate:all

# Or run individually:
npm run db:migrate:refresh-tokens
npm run db:migrate:indexes
npm run db:migrate:additional-indexes
```

### 3. Install Dependencies

```bash
# Production install (no dev dependencies)
npm ci --only=production

# Or for development
npm install
```

### 4. Build Frontend

```bash
cd frontend
npm ci
npm run build
```

### 5. Run Tests

```bash
npm test
npm run test:coverage
```

---

## Deployment Options

### Option 1: Render.com

1. **Connect Repository**
   - Push code to GitHub
   - Connect to Render

2. **Web Service Configuration**
   - Build Command: `npm ci && cd frontend && npm ci && npm run build`
   - Start Command: `npm start`
   - Environment: Node

3. **Environment Variables**
   - Add all variables from `.env.example`
   - Set `NODE_ENV=production`

4. **Database**
   - Use Render MySQL or external database
   - Update database credentials in environment variables

5. **Redis**
   - Use Render Redis or Upstash
   - Add `REDIS_URL` to environment variables

---

### Option 2: Railway.app

1. **Connect Repository**
   - Push to GitHub
   - Import project in Railway

2. **Configuration**
   - Railway auto-detects Node.js
   - Uses `package.json` start script

3. **Environment Variables**
   - Add from `.env.example`
   - Railway provides built-in MySQL and Redis

4. **Database**
   - Provision MySQL from Railway
   - Use Railway's connection string

---

### Option 3: VPS (DigitalOcean, AWS, etc.)

#### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Using Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "app.js"]
```

```bash
# Build Docker image
docker build -t moroccoedu-api .

# Run container
docker run -d \
  -p 5000:5000 \
  --env-file .env \
  --name moroccoedu \
  moroccoedu-api
```

#### Using Nginx as Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

### Option 4: Heroku

```bash
# Install Heroku CLI
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
# ... set all other variables

# Deploy
git push heroku main
```

---

## Production Best Practices

### Security
- ✅ Enable HTTPS (SSL/TLS)
- ✅ Use strong, unique secrets
- ✅ Keep dependencies updated
- ✅ Enable rate limiting
- ✅ Configure strict CORS
- ✅ Use Helmet security headers
- ✅ Store secrets in environment variables (never in code)

### Performance
- ✅ Enable Redis caching
- ✅ Use database indexes
- ✅ Enable gzip compression
- ✅ Use CDN for static assets
- ✅ Optimize images before upload
- ✅ Enable browser caching

### Monitoring
- ✅ Setup error tracking (Sentry, Bugsnag)
- ✅ Monitor server resources (CPU, RAM, Disk)
- ✅ Setup log aggregation
- ✅ Monitor database performance
- ✅ Setup uptime monitoring

### Backup
- ✅ Regular database backups (daily)
- ✅ Backup Cloudinary assets
- ✅ Store backups in multiple locations
- ✅ Test backup restoration

### Maintenance
- ✅ Regular dependency updates
- ✅ Database optimization
- ✅ Log rotation
- ✅ Cache cleanup
- ✅ Security audits

---

## Environment Variables Reference

### Required
- `NODE_ENV` - Environment (production/development)
- `PORT` - Server port
- `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` - Database
- `JWT_SECRET` - JWT signing secret (64+ chars)
- `JWT_REFRESH_SECRET` - Refresh token secret
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### Recommended
- `REDIS_URL` - Redis connection string
- `ALLOWED_ORIGINS` - CORS allowed origins
- `LOG_LEVEL` - Logging level

### Optional
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth
- `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET` - Facebook OAuth
- `FRONTEND_URL` - Frontend URL

---

## Troubleshooting

### Common Issues

**1. Database Connection Failed**
```bash
# Check database credentials
# Verify MySQL is running
# Check firewall rules
```

**2. Redis Connection Failed**
```bash
# Check Redis is running
redis-cli ping

# Verify REDIS_URL is correct
```

**3. CORS Errors**
```bash
# Check ALLOWED_ORIGINS includes your frontend URL
# Verify protocol (http vs https)
```

**4. File Upload Fails**
```bash
# Verify Cloudinary credentials
# Check file size limits
# Review Cloudinary dashboard for errors
```

---

## Support

For issues or questions:
- Check logs: `logs/combined.log`, `logs/error.log`
- Run tests: `npm test`
- Review documentation
