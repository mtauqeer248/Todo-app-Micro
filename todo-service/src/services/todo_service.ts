import { CreateTodoRequest, UpdateTodoRequest } from "../types/todo.types";
import * as TodoModel from "../models/Todo";

export async function getTodosByUser(userUuid: string) {
  return await TodoModel.findByUserUuid(userUuid);
}

export async function createTodoForUser(
  userUuid: string,
  todoData: CreateTodoRequest
) {
  return await TodoModel.create(userUuid, todoData);
}

export async function updateUserTodo(
  todoId: number,
  userUuid: string,
  updateData: UpdateTodoRequest
) {
  const existingTodo = await TodoModel.findByIdAndUser(todoId, userUuid);
  if (!existingTodo) return null;

  return await TodoModel.update(todoId, updateData);
}

export async function deleteUserTodo(todoId: number, userUuid: string) {
  const existingTodo = await TodoModel.findByIdAndUser(todoId, userUuid);
  if (!existingTodo) return false;

  return await TodoModel.remove(todoId);
}
