# Cloud-Based File Sharing System

A secure, scalable file sharing platform with end-to-end encryption, multi-cloud storage support, and real-time collaboration features. Built with Node.js, React, and TypeScript.

## 🚀 Features

### Core Functionality
- **Secure File Upload**: Support for files up to 10GB with drag-and-drop interface
- **End-to-End Encryption**: AES-256-GCM encryption for maximum security
- **Multi-Cloud Storage**: AWS S3, Google Cloud Storage, and Firebase Storage support
- **File Sharing**: Create public, private, or password-protected share links
- **User Management**: Complete authentication and authorization system
- **Storage Management**: Real-time storage usage tracking and limits

### Security Features
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- File encryption before cloud storage
- Secure share link generation
- Rate limiting and CORS protection
- Input validation and sanitization

### User Experience
- Modern, responsive React UI with Material-UI
- Real-time file upload progress
- Drag-and-drop file upload
- File preview and management
- Share link management dashboard
- Mobile-friendly design

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** for authentication
- **Multer** for file uploads
- **AWS SDK**, **Google Cloud Storage**, **Firebase Admin**
- **bcryptjs** for password hashing
- **crypto** for encryption

### Frontend
- **React 18** with TypeScript
- **Material-UI** for components
- **React Router** for navigation
- **Axios** for API calls
- **React Dropzone** for file uploads
- **Socket.io** for real-time features

### Cloud Services
- **AWS S3** for primary storage
- **Google Cloud Storage** for backup
- **Firebase Storage** for additional redundancy

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- AWS Account (for S3)
- Google Cloud Account (optional)
- Firebase Account (optional)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd cloud-file-sharing-system
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Database Setup
```bash
# Create PostgreSQL database
createdb cloud_file_sharing

# Run database schema
psql -d cloud_file_sharing -f database/schema.sql
```

### 4. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
nano .env
```

### 5. Configure Environment Variables
```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cloud_file_sharing
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name

# Google Cloud Storage Configuration (Optional)
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_KEY_FILE=path/to/service-account-key.json
GOOGLE_CLOUD_BUCKET=your-gcs-bucket-name

# Firebase Configuration (Optional)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# Encryption Configuration
ENCRYPTION_KEY=your_32_character_encryption_key_here
```

### 6. Start the Application
```bash
# Start backend server
npm run dev

# In a new terminal, start frontend
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
cloud-file-sharing-system/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── App.tsx
│   └── package.json
├── config/                 # Configuration files
│   └── database.js
├── database/               # Database schemas and migrations
│   └── schema.sql
├── middleware/             # Express middleware
│   ├── auth.js
│   └── validation.js
├── models/                 # Database models
│   ├── User.js
│   ├── File.js
│   └── Share.js
├── routes/                 # API routes
│   ├── auth.js
│   ├── files.js
│   ├── share.js
│   └── users.js
├── services/               # Business logic services
│   ├── cloudStorage.js
│   └── encryption.js
├── server.js              # Main server file
├── package.json
└── README.md
```

## 🔧 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication)

#### PUT /api/auth/profile
Update user profile (requires authentication)

### File Management Endpoints

#### POST /api/files/upload
Upload a file (requires authentication)
- Content-Type: multipart/form-data
- Body: file, isEncrypted, isPublic

#### GET /api/files
Get user's files (requires authentication)
- Query params: q (search), limit, offset

#### GET /api/files/:id
Get file details (requires authentication)

#### GET /api/files/:id/download
Download file (requires authentication)

#### PUT /api/files/:id/visibility
Update file visibility (requires authentication)

#### DELETE /api/files/:id
Delete file (requires authentication)

### Sharing Endpoints

#### POST /api/share/create
Create a share link (requires authentication)
```json
{
  "fileId": 1,
  "shareType": "public|private|password",
  "password": "optional",
  "expiresAt": "optional",
  "maxDownloads": "optional"
}
```

#### GET /api/share/:token
Get share information (public)

#### GET /api/share/:token/download
Download file from share (public)

#### POST /api/share/:token/verify
Verify share password (public)

#### GET /api/share
Get user's shares (requires authentication)

#### DELETE /api/share/:token
Delete share (requires authentication)

## 🔒 Security Features

### Encryption
- **File Encryption**: AES-256-GCM encryption for uploaded files
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure authentication tokens
- **HTTPS**: SSL/TLS encryption in production

### Access Control
- **Authentication**: JWT-based user authentication
- **Authorization**: Role-based access control
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Cross-origin resource sharing protection

### Data Protection
- **Input Validation**: Comprehensive input validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy headers
- **File Type Validation**: Secure file upload validation

## 🚀 Deployment

### Production Environment Setup

1. **Database Setup**
   ```bash
   # Create production database
   createdb cloud_file_sharing_prod
   
   # Run migrations
   psql -d cloud_file_sharing_prod -f database/schema.sql
   ```

2. **Environment Configuration**
   ```bash
   # Set production environment variables
   export NODE_ENV=production
   export DB_URL=postgresql://user:pass@host:port/db
   export JWT_SECRET=your_production_secret
   ```

3. **Build Frontend**
   ```bash
   cd client
   npm run build
   cd ..
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install

# Copy source code
COPY . .

# Build frontend
RUN cd client && npm run build

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
```

### Cloud Deployment Options

- **Heroku**: Easy deployment with PostgreSQL addon
- **AWS**: EC2 with RDS and S3
- **Google Cloud**: Compute Engine with Cloud SQL
- **DigitalOcean**: Droplet with managed database

## 🧪 Testing

### Backend Testing
```bash
# Install test dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 📊 Monitoring and Analytics

### Health Checks
- `/api/health` - Server health status
- Database connection monitoring
- Cloud storage connectivity checks

### Logging
- Request/response logging with Morgan
- Error logging and tracking
- File upload/download analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@cloudfileshare.com or create an issue in the repository.

## 🔮 Future Enhancements

- [ ] Real-time collaboration features
- [ ] AI-powered file organization
- [ ] Advanced search capabilities
- [ ] Mobile applications
- [ ] Webhook integrations
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] API rate limiting per user
- [ ] File versioning
- [ ] Advanced sharing permissions

## 🙏 Acknowledgments

- Material-UI for the beautiful component library
- React team for the amazing framework
- Express.js for the robust backend framework
- PostgreSQL for the reliable database
- AWS, Google Cloud, and Firebase for cloud services
