import { Response } from 'express';
import { TodoModel } from '../models/Todo';
import { AuthenticatedRequest } from '../middleware/auth';
import { CreateTodoRequest, UpdateTodoRequest } from '../types/todo.types';

export class TodoController {
  static async getTodos(req: AuthenticatedRequest, res: Response) {
    try {
      const userUuid = req.user!.uuid;
      const todos = await TodoModel.findByUserUuid(userUuid);
      res.json({ todos });
    } catch (error) {
      console.error('Get todos error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async createTodo(req: AuthenticatedRequest, res: Response) {
    try {
      const userUuid = req.user!.uuid;
      const todoData: CreateTodoRequest = req.body;
      
      const todo = await TodoModel.create(userUuid, todoData);
      res.status(201).json({ 
        message: 'Todo created successfully',
        todo 
      });
    } catch (error) {
      console.error('Create todo error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateTodo(req: AuthenticatedRequest, res: Response) {
    try {
      const todoId = parseInt(req.params.id);
      const userUuid = req.user!.uuid;
      const updateData: UpdateTodoRequest = req.body;

      // Check if todo exists and belongs to user
      const existingTodo = await TodoModel.findByIdAndUser(todoId, userUuid);
      if (!existingTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      const updatedTodo = await TodoModel.update(todoId, updateData);
      if (!updatedTodo) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }

      res.json({
        message: 'Todo updated successfully',
        todo: updatedTodo
      });
    } catch (error) {
      console.error('Update todo error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteTodo(req: AuthenticatedRequest, res: Response) {
    try {
      const todoId = parseInt(req.params['id']);
      const userUuid = req.user!.uuid;

      // Check if todo exists and belongs to user
      const existingTodo = await TodoModel.findByIdAndUser(todoId, userUuid);
      if (!existingTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      const deleted = await TodoModel.delete(todoId);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(500).json({ error: 'Failed to delete todo' });
      }
    } catch (error) {
      console.error('Delete todo error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}