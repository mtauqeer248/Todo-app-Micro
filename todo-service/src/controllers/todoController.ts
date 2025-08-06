import { Response } from "express";
import { TodoModel } from "../models/Todo";
import { AuthenticatedRequest } from "../middleware/auth";
import { CreateTodoRequest, UpdateTodoRequest } from "../types/todo.types";

// GET /api/todos/:id
export const getTodos = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userUuid = req.user!.uuid;
    const todos = await TodoModel.findByUserUuid(userUuid);
    res.json({ todos });
  } catch (error) {
    console.error("Get todos error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /api/todos
export const createTodo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userUuid = req.user!.uuid;
    const todoData: CreateTodoRequest = req.body;

    const todo = await TodoModel.create(userUuid, todoData);
    res.status(201).json({
      message: "Todo created successfully",
      todo,
    });
  } catch (error) {
    console.error("Create todo error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /api/todos/:id
export const updateTodo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const todoId = parseInt(req.params.id, 10);
    const userUuid = req.user!.uuid;
    const updateData: UpdateTodoRequest = req.body;

    const existingTodo = await TodoModel.findByIdAndUser(todoId, userUuid);
    if (!existingTodo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    const updatedTodo = await TodoModel.update(todoId, updateData);
    if (!updatedTodo) {
      res.status(400).json({ error: "No valid fields to update" });
      return;
    }

    res.json({
      message: "Todo updated successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    console.error("Update todo error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE /api/todos/:id
export const deleteTodo = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const todoId = parseInt(req.params.id, 10);
    const userUuid = req.user!.uuid;

    const existingTodo = await TodoModel.findByIdAndUser(todoId, userUuid);
    if (!existingTodo) {
      res.status(404).json({ error: "Todo not found" });
      return;
    }

    const deleted = await TodoModel.delete(todoId);
    if (deleted) {
      res.status(204).send(); // No Content
    } else {
      res.status(500).json({ error: "Failed to delete todo" });
    }
  } catch (error) {
    console.error("Delete todo error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
