import { Request, Response } from "express";
import {
  getTodosByUser,
  createTodoForUser,
  updateUserTodo,
  deleteUserTodo,
} from "../services/todo_service";
import * as TodoController from "../controllers/todoController";

const mockTodos = [
  { id: 1, title: "Test 1", description: "Desc 1", user_uuid: "user-123" },
  { id: 2, title: "Test 2", description: "Desc 2", user_uuid: "user-123" },
];

jest.mock("../services/todo_service", () => ({
  TodoService: {
    getUserTodos: jest.fn().mockResolvedValue(mockTodos),
    createTodo: jest.fn().mockResolvedValue(mockTodos[0]),
    updateUserTodo: jest.fn().mockResolvedValue(mockTodos[0]),
    deleteUserTodo: jest.fn().mockResolvedValue(true),
  },
}));

describe("Todo Controller + Service Tests", () => {
  const mockReq = {
    user: { uuid: "user-123" },
    body: {
      title: "Test Todo",
      description: "Test description",
    },
    params: { id: "1" },
  } as unknown as Request;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  } as unknown as Response;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /todos ", async () => {
    await TodoController.getTodos(mockReq, mockRes);

    expect(getTodosByUser).toHaveBeenCalledWith("user-123");
    expect(mockRes.json).toHaveBeenCalledWith({ todos: mockTodos });
  });

  test("POST /todos ", async () => {
    await TodoController.createTodo(mockReq, mockRes);

    expect(createTodoForUser).toHaveBeenCalledWith("user-123", mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Todo created successfully",
      todo: mockTodos[0],
    });
  });

  test("PUT /todos/:id ", async () => {
    await TodoController.updateTodo(mockReq, mockRes);

    expect(updateUserTodo).toHaveBeenCalledWith(1, "user-123", mockReq.body);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Todo updated successfully",
      todo: mockTodos[0],
    });
  });

  test("DELETE /todos/:id", async () => {
    await TodoController.deleteTodo(mockReq, mockRes);

    expect(deleteUserTodo).toHaveBeenCalledWith(1, "user-123");
    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.send).toHaveBeenCalled();
  });
});
