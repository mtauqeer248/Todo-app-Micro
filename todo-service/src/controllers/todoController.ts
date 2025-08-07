import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import * as TodoService from "../services/todo_service";


export const getTodos = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const todos = await TodoService.getTodosByUser(req.user!.uuid);
    res.json({ todos });
  } catch (error) {
    console.error("Get todos error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const createTodo = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const todo = await TodoService.createTodoForUser(req.user!.uuid, req.body);
    res.status(201).json({ message: "Todo created successfully", todo });
  } catch (error) {
    console.error("Create todo error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const updateTodo = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const todoId = parseInt(req.params.id, 10);
    const updatedTodo = await TodoService.updateUserTodo(
      todoId,
      req.user!.uuid,
      req.body
    );

    if (!updatedTodo) {
      return res
        .status(404)
        .json({ error: "Todo not found or no valid fields to update" });
    }

    return res.json({
      message: "Todo updated successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    console.error("Update todo error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTodo = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const todoId = parseInt(req.params.id, 10);
    const deleted = await TodoService.deleteUserTodo(todoId, req.user!.uuid);

    if (!deleted) {
      return res.status(404).json({ error: "Todo not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Delete todo error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
