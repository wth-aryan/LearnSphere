# Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Git

## Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd cloud-file-sharing-system
npm install
cd client && npm install && cd ..
```

### 2. Database Setup
```bash
# Create database
createdb cloud_file_sharing

# Run schema
psql -d cloud_file_sharing -f database/schema.sql
```

### 3. Environment Setup
```bash
# Copy environment template
cp env.example .env

# Edit .env with your settings
nano .env
```

**Minimum required environment variables:**
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cloud_file_sharing
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_32_character_key_here
```

### 4. Start Application

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
./start.sh
```

**Manual:**
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client && npm start
```

### 5. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## First Steps

1. **Register Account**: Go to http://localhost:3000/register
2. **Upload Files**: Use the upload page to add files
3. **Create Shares**: Generate share links for your files
4. **Manage Storage**: Monitor your storage usage

## Cloud Storage Setup (Optional)

### AWS S3
1. Create S3 bucket
2. Generate access keys
3. Add to .env:
   ```env
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your-bucket-name
   ```

### Google Cloud Storage
1. Create GCS bucket
2. Generate service account key
3. Add to .env:
   ```env
   GOOGLE_CLOUD_PROJECT_ID=your-project
   GOOGLE_CLOUD_KEY_FILE=path/to/key.json
   GOOGLE_CLOUD_BUCKET=your-bucket-name
   ```

## Troubleshooting

### Common Issues

**Database Connection Error:**
- Check PostgreSQL is running
- Verify database credentials in .env
- Ensure database exists

**Port Already in Use:**
- Change PORT in .env
- Kill existing processes on ports 3000/5000

**File Upload Fails:**
- Check file size limits
- Verify cloud storage credentials
- Check disk space

**Frontend Won't Start:**
- Run `cd client && npm install`
- Check Node.js version
- Clear npm cache: `npm cache clean --force`

### Getting Help

1. Check the logs in terminal
2. Verify all environment variables
3. Ensure all dependencies are installed
4. Check database connection
5. Review the full README.md for detailed setup

## Production Deployment

For production deployment, see the main README.md file for detailed instructions on:
- Environment configuration
- Database setup
- Cloud service configuration
- Security considerations
- Monitoring and logging
