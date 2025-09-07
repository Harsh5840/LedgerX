# Environment Variables Setup Guide

This guide will help you set up all the required environment variables for the LedgerX application.

## Quick Setup

Run this command to copy all example files to actual environment files:

```bash
# Copy all .env.example files to .env files
cp .env.example .env
cp apps/ledgerX-backend/.env.example apps/ledgerX-backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local
cp packages/ai/.env.example packages/ai/.env
cp packages/db/.env.example packages/db/.env
cp packages/core/.env.example packages/core/.env
```

## Required Environment Files

### 1. Root Level (`.env`)
Global configuration shared across the monorepo.

**Key Variables to Update:**
- `GLOBAL_DATABASE_URL` - Your PostgreSQL connection string
- `GLOBAL_ENCRYPTION_KEY` - 32-character encryption key
- `GLOBAL_JWT_SECRET` - JWT secret (min 32 characters)

### 2. Backend (`apps/ledgerX-backend/.env`)
Backend API server configuration.

**Key Variables to Update:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT secret for authentication
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET` - GitHub OAuth
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - Google OAuth

### 3. Frontend (`apps/frontend/.env.local`)
Next.js frontend configuration.

**Key Variables to Update:**
- `NEXT_PUBLIC_API_URL` - Backend API URL (http://localhost:5000)
- `NEXT_PUBLIC_GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID

### 4. AI Package (`packages/ai/.env`)
AI and machine learning services configuration.

**Key Variables to Update:**
- `OPENAI_API_KEY` - OpenAI API key
- `GOOGLE_API_KEY` - Google AI API key
- `HUGGINGFACE_API_TOKEN` - Hugging Face API token
- `DEEPSEEK_API_KEY` - DeepSeek API key

### 5. Database Package (`packages/db/.env`)
Database and Prisma configuration.

**Key Variables to Update:**
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string (optional)

### 6. Core Package (`packages/core/.env`)
Core ledger functionality configuration.

**Key Variables to Update:**
- `ENCRYPTION_KEY` - 32-character encryption key
- `DEFAULT_RISK_THRESHOLD` - Risk assessment threshold

## API Keys Setup

### 1. Database Setup (PostgreSQL)

```bash
# Install PostgreSQL (if not installed)
# On macOS with Homebrew:
brew install postgresql
brew services start postgresql

# Create database and user
createdb ledgerx_db
createuser ledgerx_user -P  # Will prompt for password

# Grant permissions
psql -d ledgerx_db -c "GRANT ALL PRIVILEGES ON DATABASE ledgerx_db TO ledgerx_user;"
```

**Database URL Format:**
```
postgresql://ledgerx_user:your_password@localhost:5432/ledgerx_db
```

### 2. OpenAI API Key

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-`)
4. Add to your environment files

### 3. Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable required APIs (AI Platform, OAuth2)
4. Create credentials (API Key and OAuth2 Client)
5. Add to your environment files

### 4. GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:5000/auth/github/callback`
4. Copy Client ID and Client Secret
5. Add to your environment files

### 5. Hugging Face Token

1. Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Create a new token
3. Copy the token (starts with `hf_`)
4. Add to your environment files

## Security Best Practices

### 1. Generate Secure Keys

```bash
# Generate 32-character encryption key
openssl rand -hex 32

# Generate JWT secret
openssl rand -base64 32

# Generate session secret
openssl rand -base64 32
```

### 2. Environment File Permissions

```bash
# Set proper permissions for .env files
chmod 600 .env
chmod 600 apps/ledgerX-backend/.env
chmod 600 apps/frontend/.env.local
chmod 600 packages/*/.env
```

### 3. Never Commit Real Keys

- Always use `.env.example` files for templates
- Real `.env` files are in `.gitignore`
- Use different keys for development/staging/production

## Validation

After setting up your environment files, validate the configuration:

```bash
# Test database connection
pnpm --filter @ledgerX/db exec prisma db pull

# Test build
pnpm build

# Test development server
pnpm dev
```

## Environment-Specific Configurations

### Development
- Use `NODE_ENV=development`
- Enable debug logging
- Use local database
- Disable rate limiting

### Production
- Use `NODE_ENV=production`
- Enable all security features
- Use production database
- Enable monitoring and logging
- Use secure HTTPS URLs

### Testing
- Use separate test database
- Mock external API calls
- Use test-specific API keys

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify connection string format
   - Check user permissions

2. **API Key Invalid**
   - Verify key format (OpenAI starts with `sk-`)
   - Check key permissions and quotas
   - Ensure no extra spaces or characters

3. **OAuth Redirect Mismatch**
   - Verify callback URLs in OAuth app settings
   - Check frontend/backend URL configuration

4. **Build Failures**
   - Ensure all required environment variables are set
   - Check for typos in variable names
   - Verify file permissions

### Getting Help

If you encounter issues:
1. Check the logs in `logs/` directory
2. Verify environment variable names match exactly
3. Test individual services separately
4. Check API key quotas and limits

## Next Steps

After setting up environment variables:
1. Run database migrations: `pnpm --filter @ledgerX/db exec prisma migrate dev`
2. Generate Prisma client: `pnpm --filter @ledgerX/db exec prisma generate`
3. Start development: `pnpm dev`
4. Access the application at `http://localhost:3000`