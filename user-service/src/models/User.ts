import { pool } from '../config/database';
import { User, CreateUserRequest } from '../types/user.types';

export async function findUserByEmail(email: string): Promise<User | null> {
  const query = `
    SELECT uuid, email, password_hash AS password, created_at, updated_at
    FROM users
    WHERE email = $1
  `;
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
}

export async function createUser(userData: CreateUserRequest): Promise<User> {
  const query = `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING uuid, email, password_hash AS password, created_at, updated_at
  `;
  const result = await pool.query(query, [userData.email, userData.password]);
  return result.rows[0];
}

export async function findUserByUuid(uuid: string): Promise<User | null> {
  const query = `
    SELECT uuid, email, password_hash AS password, created_at, updated_at
    FROM users
    WHERE uuid = $1
  `;
  const result = await pool.query(query, [uuid]);
  return result.rows[0] || null;
}
