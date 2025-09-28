const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.username = data.username;
    this.password = data.password;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.avatar = data.avatar;
    this.storageUsed = data.storage_used || 0;
    this.storageLimit = data.storage_limit || 10737418240; // 10GB default
    this.isActive = data.is_active;
    this.emailVerified = data.email_verified;
    this.lastLogin = data.last_login;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async create(userData) {
    const { email, username, password, firstName, lastName } = userData;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const query = `
      INSERT INTO users (email, username, password, first_name, last_name, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `;
    
    const values = [email, username, hashedPassword, firstName, lastName];
    const result = await pool.query(query, values);
    return new User(result.rows[0]);
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows.length > 0 ? new User(result.rows[0]) : null;
  }

  async validatePassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  async updateLastLogin() {
    const query = 'UPDATE users SET last_login = NOW() WHERE id = $1';
    await pool.query(query, [this.id]);
  }

  async updateStorageUsed(size) {
    const query = 'UPDATE users SET storage_used = storage_used + $1 WHERE id = $2';
    await pool.query(query, [size, this.id]);
    this.storageUsed += size;
  }

  async updateProfile(updateData) {
    const { firstName, lastName, avatar } = updateData;
    const query = `
      UPDATE users 
      SET first_name = $1, last_name = $2, avatar = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;
    const result = await pool.query(query, [firstName, lastName, avatar, this.id]);
    return new User(result.rows[0]);
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      avatar: this.avatar,
      storageUsed: this.storageUsed,
      storageLimit: this.storageLimit,
      isActive: this.isActive,
      emailVerified: this.emailVerified,
      lastLogin: this.lastLogin,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = User;
