const pool = require('../config/database');
const crypto = require('crypto');

class File {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.originalName = data.original_name;
    this.fileName = data.file_name;
    this.filePath = data.file_path;
    this.fileSize = data.file_size;
    this.mimeType = data.mime_type;
    this.encryptionKey = data.encryption_key;
    this.checksum = data.checksum;
    this.isEncrypted = data.is_encrypted;
    this.isPublic = data.is_public;
    this.downloadCount = data.download_count || 0;
    this.lastAccessed = data.last_accessed;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async create(fileData) {
    const {
      userId,
      originalName,
      fileName,
      filePath,
      fileSize,
      mimeType,
      encryptionKey,
      checksum,
      isEncrypted = false,
      isPublic = false
    } = fileData;

    const query = `
      INSERT INTO files (
        user_id, original_name, file_name, file_path, file_size, 
        mime_type, encryption_key, checksum, is_encrypted, is_public, 
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      userId, originalName, fileName, filePath, fileSize,
      mimeType, encryptionKey, checksum, isEncrypted, isPublic
    ];

    const result = await pool.query(query, values);
    return new File(result.rows[0]);
  }

  static async findById(id) {
    const query = 'SELECT * FROM files WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? new File(result.rows[0]) : null;
  }

  static async findByUserId(userId, limit = 50, offset = 0) {
    const query = `
      SELECT * FROM files 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows.map(row => new File(row));
  }

  static async findByChecksum(checksum) {
    const query = 'SELECT * FROM files WHERE checksum = $1';
    const result = await pool.query(query, [checksum]);
    return result.rows.length > 0 ? new File(result.rows[0]) : null;
  }

  static async searchFiles(userId, searchTerm, limit = 50, offset = 0) {
    const query = `
      SELECT * FROM files 
      WHERE user_id = $1 
      AND (original_name ILIKE $2 OR file_name ILIKE $2)
      ORDER BY created_at DESC 
      LIMIT $3 OFFSET $4
    `;
    const searchPattern = `%${searchTerm}%`;
    const result = await pool.query(query, [userId, searchPattern, limit, offset]);
    return result.rows.map(row => new File(row));
  }

  static async getTotalSizeByUserId(userId) {
    const query = 'SELECT SUM(file_size) as total_size FROM files WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].total_size) || 0;
  }

  async updateDownloadCount() {
    const query = 'UPDATE files SET download_count = download_count + 1, last_accessed = NOW() WHERE id = $1';
    await pool.query(query, [this.id]);
    this.downloadCount += 1;
    this.lastAccessed = new Date();
  }

  async updateVisibility(isPublic) {
    const query = 'UPDATE files SET is_public = $1, updated_at = NOW() WHERE id = $2';
    await pool.query(query, [isPublic, this.id]);
    this.isPublic = isPublic;
  }

  async delete() {
    const query = 'DELETE FROM files WHERE id = $1';
    await pool.query(query, [this.id]);
  }

  static generateChecksum(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  static generateEncryptionKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      originalName: this.originalName,
      fileName: this.fileName,
      filePath: this.filePath,
      fileSize: this.fileSize,
      mimeType: this.mimeType,
      isEncrypted: this.isEncrypted,
      isPublic: this.isPublic,
      downloadCount: this.downloadCount,
      lastAccessed: this.lastAccessed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = File;
