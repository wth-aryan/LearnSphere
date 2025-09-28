const crypto = require('crypto');

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32; // 256 bits
    this.ivLength = 16; // 128 bits
    this.tagLength = 16; // 128 bits
    this.saltLength = 64; // 512 bits
  }

  generateKey() {
    return crypto.randomBytes(this.keyLength).toString('hex');
  }

  generateIV() {
    return crypto.randomBytes(this.ivLength);
  }

  generateSalt() {
    return crypto.randomBytes(this.saltLength);
  }

  deriveKey(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, this.keyLength, 'sha512');
  }

  encrypt(data, key) {
    try {
      const iv = this.generateIV();
      const cipher = crypto.createCipherGCM(this.algorithm, key, iv);
      
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();
      
      return {
        encrypted: encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex')
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  decrypt(encryptedData, key, iv, tag) {
    try {
      const decipher = crypto.createDecipherGCM(this.algorithm, key, Buffer.from(iv, 'hex'));
      decipher.setAuthTag(Buffer.from(tag, 'hex'));
      
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  encryptFile(fileBuffer, key) {
    try {
      const iv = this.generateIV();
      const cipher = crypto.createCipherGCM(this.algorithm, key, iv);
      
      const encrypted = Buffer.concat([
        cipher.update(fileBuffer),
        cipher.final()
      ]);
      
      const tag = cipher.getAuthTag();
      
      return {
        encrypted: encrypted,
        iv: iv,
        tag: tag
      };
    } catch (error) {
      console.error('File encryption error:', error);
      throw new Error('Failed to encrypt file');
    }
  }

  decryptFile(encryptedBuffer, key, iv, tag) {
    try {
      const decipher = crypto.createDecipherGCM(this.algorithm, key, iv);
      decipher.setAuthTag(tag);
      
      const decrypted = Buffer.concat([
        decipher.update(encryptedBuffer),
        decipher.final()
      ]);
      
      return decrypted;
    } catch (error) {
      console.error('File decryption error:', error);
      throw new Error('Failed to decrypt file');
    }
  }

  encryptWithPassword(data, password) {
    const salt = this.generateSalt();
    const key = this.deriveKey(password, salt);
    const encrypted = this.encrypt(data, key);
    
    return {
      encrypted: encrypted.encrypted,
      iv: encrypted.iv,
      tag: encrypted.tag,
      salt: salt.toString('hex')
    };
  }

  decryptWithPassword(encryptedData, password, salt, iv, tag) {
    const key = this.deriveKey(password, Buffer.from(salt, 'hex'));
    return this.decrypt(encryptedData, key, iv, tag);
  }

  generateHash(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  generateHMAC(data, key) {
    return crypto.createHmac('sha256', key).update(data).digest('hex');
  }

  verifyHMAC(data, key, hmac) {
    const expectedHmac = this.generateHMAC(data, key);
    return crypto.timingSafeEqual(Buffer.from(hmac, 'hex'), Buffer.from(expectedHmac, 'hex'));
  }

  generateRandomString(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // End-to-end encryption for file sharing
  async encryptFileForSharing(fileBuffer, recipientPublicKey) {
    try {
      // Generate a random symmetric key for file encryption
      const fileKey = this.generateKey();
      
      // Encrypt the file with the symmetric key
      const encryptedFile = this.encryptFile(fileBuffer, fileKey);
      
      // In a real implementation, you would encrypt the fileKey with the recipient's public key
      // For this example, we'll use a simplified approach
      const encryptedFileKey = this.encrypt(fileKey, recipientPublicKey);
      
      return {
        encryptedFile: encryptedFile.encrypted,
        iv: encryptedFile.iv,
        tag: encryptedFile.tag,
        encryptedFileKey: encryptedFileKey.encrypted,
        keyIV: encryptedFileKey.iv,
        keyTag: encryptedFileKey.tag
      };
    } catch (error) {
      console.error('File sharing encryption error:', error);
      throw new Error('Failed to encrypt file for sharing');
    }
  }

  async decryptFileForSharing(encryptedData, privateKey) {
    try {
      const {
        encryptedFile,
        iv,
        tag,
        encryptedFileKey,
        keyIV,
        keyTag
      } = encryptedData;
      
      // Decrypt the file key with the private key
      const fileKey = this.decrypt(encryptedFileKey, privateKey, keyIV, keyTag);
      
      // Decrypt the file with the file key
      const decryptedFile = this.decryptFile(encryptedFile, fileKey, iv, tag);
      
      return decryptedFile;
    } catch (error) {
      console.error('File sharing decryption error:', error);
      throw new Error('Failed to decrypt file for sharing');
    }
  }
}

module.exports = new EncryptionService();
