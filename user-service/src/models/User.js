"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = require("../config/database");
class UserModel {
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await database_1.pool.query(query, [email]);
        return result.rows[0] || null;
    }
    static async create(userData) {
        const query = `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING *
    `;
        const result = await database_1.pool.query(query, [userData.email, userData.password_hash]);
        return result.rows[0];
    }
    static async findByUuid(uuid) {
        const query = 'SELECT * FROM users WHERE uuid = $1';
        const result = await database_1.pool.query(query, [uuid]);
        return result.rows[0] || null;
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=User.js.map