import { pool } from "../config/database";
import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
} from "../types/todo.types";

export async function findByUserUuid(userUuid: string): Promise<Todo[]> {
  const query =
    "SELECT * FROM todos WHERE user_uuid = $1 ORDER BY created_at DESC";
  const result = await pool.query(query, [userUuid]);
  return result.rows;
}

export async function findById(id: number): Promise<Todo | null> {
  const query = "SELECT * FROM todos WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

export async function create(
  userUuid: string,
  todoData: CreateTodoRequest
): Promise<Todo> {
  const query = `
    INSERT INTO todos (user_uuid, title, description)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const result = await pool.query(query, [
    userUuid,
    todoData.title,
    todoData.description || "",
  ]);
  return result.rows[0];
}

export async function update(
  id: number,
  todoData: UpdateTodoRequest
): Promise<Todo | null> {
  const updates = [];
  const values = [];
  let paramCount = 1;

  if (todoData.title !== undefined) {
    updates.push(`title = $${paramCount++}`);
    values.push(todoData.title);
  }
  if (todoData.description !== undefined) {
    updates.push(`description = $${paramCount++}`);
    values.push(todoData.description);
  }
  if (todoData.completed !== undefined) {
    updates.push(`completed = $${paramCount++}`);
    values.push(todoData.completed);
  }

  if (updates.length === 0) {
    return null;
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const query = `
    UPDATE todos 
    SET ${updates.join(", ")}
    WHERE id = $${paramCount}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

export async function remove(id: number): Promise<boolean> {
  const query = "DELETE FROM todos WHERE id = $1";
  const result = await pool.query(query, [id]);
  return (result.rowCount || 0) > 0;
}

export async function findByIdAndUser(
  id: number,
  userUuid: string
): Promise<Todo | null> {
  const query = "SELECT * FROM todos WHERE id = $1 AND user_uuid = $2";
  const result = await pool.query(query, [id, userUuid]);
  return result.rows[0] || null;
}
