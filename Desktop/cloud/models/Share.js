const pool = require('../config/database');
const crypto = require('crypto');

class Share {
  constructor(data) {
    this.id = data.id;
    this.fileId = data.file_id;
    this.userId = data.user_id;
    this.shareToken = data.share_token;
    this.shareType = data.share_type; // 'public', 'private', 'password'
    this.password = data.password;
    this.expiresAt = data.expires_at;
    this.maxDownloads = data.max_downloads;
    this.downloadCount = data.download_count || 0;
    this.isActive = data.is_active;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async create(shareData) {
    const {
      fileId,
      userId,
      shareType = 'public',
      password = null,
      expiresAt = null,
      maxDownloads = null
    } = shareData;

    const shareToken = crypto.randomBytes(32).toString('hex');

    const query = `
      INSERT INTO shares (
        file_id, user_id, share_token, share_type, password, 
        expires_at, max_downloads, is_active, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())
      RETURNING *
    `;

    const values = [fileId, userId, shareToken, shareType, password, expiresAt, maxDownloads];
    const result = await pool.query(query, values);
    return new Share(result.rows[0]);
  }

  static async findByToken(shareToken) {
    const query = `
      SELECT s.*, f.*, u.username, u.email
      FROM shares s
      JOIN files f ON s.file_id = f.id
      JOIN users u ON s.user_id = u.id
      WHERE s.share_token = $1 AND s.is_active = true
    `;
    const result = await pool.query(query, [shareToken]);
    return result.rows.length > 0 ? new Share(result.rows[0]) : null;
  }

  static async findByFileId(fileId) {
    const query = 'SELECT * FROM shares WHERE file_id = $1 AND is_active = true';
    const result = await pool.query(query, [fileId]);
    return result.rows.map(row => new Share(row));
  }

  static async findByUserId(userId) {
    const query = `
      SELECT s.*, f.original_name, f.file_size, f.mime_type
      FROM shares s
      JOIN files f ON s.file_id = f.id
      WHERE s.user_id = $1 AND s.is_active = true
      ORDER BY s.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows.map(row => new Share(row));
  }

  async validatePassword(password) {
    if (this.shareType !== 'password') return true;
    return this.password === password;
  }

  async isExpired() {
    if (!this.expiresAt) return false;
    return new Date() > new Date(this.expiresAt);
  }

  async canDownload() {
    if (!this.isActive) return false;
    if (this.isExpired()) return false;
    if (this.maxDownloads && this.downloadCount >= this.maxDownloads) return false;
    return true;
  }

  async incrementDownloadCount() {
    const query = 'UPDATE shares SET download_count = download_count + 1 WHERE id = $1';
    await pool.query(query, [this.id]);
    this.downloadCount += 1;
  }

  async deactivate() {
    const query = 'UPDATE shares SET is_active = false, updated_at = NOW() WHERE id = $1';
    await pool.query(query, [this.id]);
    this.isActive = false;
  }

  async delete() {
    const query = 'DELETE FROM shares WHERE id = $1';
    await pool.query(query, [this.id]);
  }

  toJSON() {
    return {
      id: this.id,
      fileId: this.fileId,
      userId: this.userId,
      shareToken: this.shareToken,
      shareType: this.shareType,
      expiresAt: this.expiresAt,
      maxDownloads: this.maxDownloads,
      downloadCount: this.downloadCount,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Share;
