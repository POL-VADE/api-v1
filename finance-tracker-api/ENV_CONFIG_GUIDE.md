# Environment Configuration Guide

## 🔧 Updated .env.example with Security Enhancements

Copy this content to your `.env.example` file:

```env
# ==============================================
# FINANCE TRACKER API - ENVIRONMENT CONFIGURATION
# ==============================================

# Application Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
# Option 1: Individual database connection parameters
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=1
DB_DATABASE=fdb
DB_SYNCHRONIZE=false

# Option 2: PostgreSQL connection URL (recommended for production)
# DATABASE_URL="postgresql://postgres:1@localhost:5432/fdb"
# DIRECT_URL="postgresql://postgres:1@localhost:5432/fdb"

# Database Pool Configuration (Optional)
DB_POOL_SIZE=10
DB_CONNECTION_TIMEOUT=5000
DB_IDLE_TIMEOUT=30000

# JWT Security Configuration
# SECURITY: Use a strong secret (minimum 32 characters) in production
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_jwt_secret_key_change_this_to_32_plus_characters_in_production
# SECURITY: Reduced from 24h to 2h for better security
JWT_EXPIRATION=2h

# SMS Service Configuration (Required for OTP functionality)
# Get these from your SMS provider (Twilio, AWS SNS, etc.)
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=your_sender_id

# CORS Configuration
# SECURITY: Restrict to your domain in production
CORS_ORIGIN=http://localhost:3000

# Rate Limiting Configuration (Security Enhancement)
# SECURITY: Prevents brute force and DoS attacks
RATE_LIMIT_TTL=60          # Time window in seconds (1 minute)
RATE_LIMIT_MAX=50          # Max requests per window per IP (development)

# ==============================================
# PRODUCTION SECURITY RECOMMENDATIONS
# ==============================================
# When deploying to production, update these values:
#
# NODE_ENV=production
# JWT_SECRET=generate-a-strong-random-32-plus-character-secret
# JWT_EXPIRATION=2h                    # Keep at 2h for security
# CORS_ORIGIN=https://yourdomain.com
# RATE_LIMIT_TTL=60
# RATE_LIMIT_MAX=30                    # Stricter limit for production
# DATABASE_URL=your-production-database-url
# SMS_API_KEY=your-production-sms-key
# SMS_SENDER_ID=your-production-sender-id
```

## 🔒 Security Features Implemented

✅ **OTP Attempt Limiting**: Max 5 failed attempts → 15min lockout  
✅ **Rate Limiting**: Multiple tiers (OTP, login, registration)  
✅ **Environment-based OTP exposure**: Only in development  
✅ **Reduced OTP expiry**: 3 minutes (down from 5 minutes)  
✅ **Secure error handling**: No sensitive data in logs  
✅ **User enumeration protection**: Unified OTP endpoint  
✅ **JWT security**: Configurable expiration, issuer/audience claims

## 📋 Production Security Checklist

- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Set JWT_EXPIRATION to 2h or less
- [ ] Configure proper CORS_ORIGIN
- [ ] Set up SSL/HTTPS
- [ ] Use production SMS credentials
- [ ] Set NODE_ENV=production
- [ ] Monitor rate limit violations
- [ ] Set up database backups
- [ ] Configure proper logging
- [ ] Implement monitoring/alerting

## 🔄 Key Changes from Your Original .env.example

| Variable         | Old Value   | New Value               | Reason            |
| ---------------- | ----------- | ----------------------- | ----------------- |
| `JWT_EXPIRATION` | `24h`       | `2h`                    | Enhanced security |
| `CORS_ORIGIN`    | Not present | `http://localhost:3000` | CORS security     |
| `RATE_LIMIT_TTL` | Not present | `60`                    | Rate limiting     |
| `RATE_LIMIT_MAX` | Not present | `50`                    | Rate limiting     |

## 🚀 Quick Setup Instructions

1. **Copy the updated configuration** above to your `.env.example` file
2. **Create your local .env** file: `cp .env.example .env`
3. **Generate a strong JWT secret**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. **Update your local .env** with the generated secret
5. **Configure your SMS provider** credentials
6. **Test the security features** work correctly

## 🌍 Environment-Specific Behavior

### Development (NODE_ENV=development)

- OTP codes visible in console logs
- OTP codes returned in API responses
- Relaxed rate limiting (50 req/min)
- Detailed error messages

### Production (NODE_ENV=production)

- No OTP exposure in logs or responses
- Strict rate limiting (30 req/min recommended)
- Generic error messages
- Enhanced security headers

## 🔧 Generate Strong JWT Secret Command

```bash
# Run this command to generate a secure JWT secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

## 📞 SMS Provider Setup

Choose one of these providers for OTP delivery:

### Twilio

```env
SMS_API_KEY=your_twilio_auth_token
SMS_SENDER_ID=your_twilio_phone_number
```

### AWS SNS

```env
SMS_API_KEY=your_aws_access_key
SMS_SENDER_ID=your_sns_sender_id
```

### Other Providers

Configure according to your SMS provider's documentation.

---

**Next Steps**: Copy the configuration above to your `.env.example` file and create your local `.env` file with your actual values!
