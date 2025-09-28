const AWS = require('aws-sdk');
const { Storage } = require('@google-cloud/storage');
const admin = require('firebase-admin');
const crypto = require('crypto');

class CloudStorageService {
  constructor() {
    this.initializeServices();
  }

  initializeServices() {
    // Initialize AWS S3
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-1'
      });
      this.s3 = new AWS.S3();
      this.s3Bucket = process.env.AWS_S3_BUCKET;
    }

    // Initialize Google Cloud Storage
    if (process.env.GOOGLE_CLOUD_PROJECT_ID) {
      this.gcs = new Storage({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE
      });
      this.gcsBucket = this.gcs.bucket(process.env.GOOGLE_CLOUD_BUCKET);
    }

    // Initialize Firebase Storage
    if (process.env.FIREBASE_PROJECT_ID) {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL
          })
        });
      }
      this.firebaseStorage = admin.storage();
      this.firebaseBucket = this.firebaseStorage.bucket();
    }
  }

  async uploadFile(fileBuffer, fileName, mimeType, options = {}) {
    const { provider = 's3', folder = 'files', encryption = false } = options;
    
    const filePath = `${folder}/${Date.now()}-${fileName}`;
    
    try {
      let result;
      
      switch (provider) {
        case 's3':
          result = await this.uploadToS3(fileBuffer, filePath, mimeType, encryption);
          break;
        case 'gcs':
          result = await this.uploadToGCS(fileBuffer, filePath, mimeType, encryption);
          break;
        case 'firebase':
          result = await this.uploadToFirebase(fileBuffer, filePath, mimeType, encryption);
          break;
        default:
          throw new Error('Unsupported cloud provider');
      }

      return {
        success: true,
        filePath: result.filePath,
        url: result.url,
        provider,
        size: fileBuffer.length
      };
    } catch (error) {
      console.error('Cloud upload error:', error);
      throw new Error('Failed to upload file to cloud storage');
    }
  }

  async uploadToS3(fileBuffer, filePath, mimeType, encryption = false) {
    const uploadParams = {
      Bucket: this.s3Bucket,
      Key: filePath,
      Body: fileBuffer,
      ContentType: mimeType,
      ServerSideEncryption: encryption ? 'AES256' : undefined
    };

    const result = await this.s3.upload(uploadParams).promise();
    return {
      filePath: result.Key,
      url: result.Location
    };
  }

  async uploadToGCS(fileBuffer, filePath, mimeType, encryption = false) {
    const file = this.gcsBucket.file(filePath);
    
    const stream = file.createWriteStream({
      metadata: {
        contentType: mimeType,
        encryption: encryption ? 'AES256' : undefined
      }
    });

    return new Promise((resolve, reject) => {
      stream.on('error', reject);
      stream.on('finish', () => {
        resolve({
          filePath: filePath,
          url: `https://storage.googleapis.com/${this.gcsBucket.name}/${filePath}`
        });
      });
      stream.end(fileBuffer);
    });
  }

  async uploadToFirebase(fileBuffer, filePath, mimeType, encryption = false) {
    const file = this.firebaseBucket.file(filePath);
    
    const stream = file.createWriteStream({
      metadata: {
        contentType: mimeType,
        metadata: {
          encrypted: encryption.toString()
        }
      }
    });

    return new Promise((resolve, reject) => {
      stream.on('error', reject);
      stream.on('finish', async () => {
        const [url] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 1000 * 60 * 60 * 24 * 365 // 1 year
        });
        resolve({
          filePath: filePath,
          url: url
        });
      });
      stream.end(fileBuffer);
    });
  }

  async downloadFile(filePath, provider = 's3') {
    try {
      let result;
      
      switch (provider) {
        case 's3':
          result = await this.downloadFromS3(filePath);
          break;
        case 'gcs':
          result = await this.downloadFromGCS(filePath);
          break;
        case 'firebase':
          result = await this.downloadFromFirebase(filePath);
          break;
        default:
          throw new Error('Unsupported cloud provider');
      }

      return {
        success: true,
        data: result.data,
        contentType: result.contentType
      };
    } catch (error) {
      console.error('Cloud download error:', error);
      throw new Error('Failed to download file from cloud storage');
    }
  }

  async downloadFromS3(filePath) {
    const params = {
      Bucket: this.s3Bucket,
      Key: filePath
    };

    const result = await this.s3.getObject(params).promise();
    return {
      data: result.Body,
      contentType: result.ContentType
    };
  }

  async downloadFromGCS(filePath) {
    const file = this.gcsBucket.file(filePath);
    const [data] = await file.download();
    const [metadata] = await file.getMetadata();
    
    return {
      data: data,
      contentType: metadata.contentType
    };
  }

  async downloadFromFirebase(filePath) {
    const file = this.firebaseBucket.file(filePath);
    const [data] = await file.download();
    const [metadata] = await file.getMetadata();
    
    return {
      data: data,
      contentType: metadata.contentType
    };
  }

  async deleteFile(filePath, provider = 's3') {
    try {
      switch (provider) {
        case 's3':
          await this.deleteFromS3(filePath);
          break;
        case 'gcs':
          await this.deleteFromGCS(filePath);
          break;
        case 'firebase':
          await this.deleteFromFirebase(filePath);
          break;
        default:
          throw new Error('Unsupported cloud provider');
      }

      return { success: true };
    } catch (error) {
      console.error('Cloud delete error:', error);
      throw new Error('Failed to delete file from cloud storage');
    }
  }

  async deleteFromS3(filePath) {
    const params = {
      Bucket: this.s3Bucket,
      Key: filePath
    };
    await this.s3.deleteObject(params).promise();
  }

  async deleteFromGCS(filePath) {
    const file = this.gcsBucket.file(filePath);
    await file.delete();
  }

  async deleteFromFirebase(filePath) {
    const file = this.firebaseBucket.file(filePath);
    await file.delete();
  }

  async getSignedUrl(filePath, provider = 's3', expiresIn = 3600) {
    try {
      let url;
      
      switch (provider) {
        case 's3':
          url = await this.getS3SignedUrl(filePath, expiresIn);
          break;
        case 'gcs':
          url = await this.getGCSSignedUrl(filePath, expiresIn);
          break;
        case 'firebase':
          url = await this.getFirebaseSignedUrl(filePath, expiresIn);
          break;
        default:
          throw new Error('Unsupported cloud provider');
      }

      return { success: true, url };
    } catch (error) {
      console.error('Signed URL generation error:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  async getS3SignedUrl(filePath, expiresIn) {
    const params = {
      Bucket: this.s3Bucket,
      Key: filePath,
      Expires: expiresIn
    };
    return this.s3.getSignedUrl('getObject', params);
  }

  async getGCSSignedUrl(filePath, expiresIn) {
    const file = this.gcsBucket.file(filePath);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresIn * 1000
    });
    return url;
  }

  async getFirebaseSignedUrl(filePath, expiresIn) {
    const file = this.firebaseBucket.file(filePath);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresIn * 1000
    });
    return url;
  }
}

module.exports = new CloudStorageService();
