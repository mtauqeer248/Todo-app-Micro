import { pool } from '../config/database';
import { User, CreateUserRequest } from '../types/user.types';

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async create(userData: CreateUserRequest & { password_hash: string }): Promise<User> {
    const query = `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(query, [userData.email, userData.password_hash]);
    return result.rows[0];
  }

  static async findByUuid(uuid: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE uuid = $1';
    const result = await pool.query(query, [uuid]);
    return result.rows[0] || null;
  }
}