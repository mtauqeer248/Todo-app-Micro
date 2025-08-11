// ✅ mock before requiring the controller
const mockTodos = [
  { id: 1, title: "Test 1", description: "Desc 1", user_uuid: "user-123" },
  { id: 2, title: "Test 2", description: "Desc 2", user_uuid: "user-123" },
];

jest.mock("../services/todo_service", () => ({
  getTodosByUser: jest.fn(),
  createTodoForUser: jest.fn(),
  updateUserTodo: jest.fn(),
  deleteUserTodo: jest.fn(),
}));

// Now require after mocks are set up
const {
  getTodosByUser,
  createTodoForUser,
  updateUserTodo,
  deleteUserTodo,
} = require("../services/todo_service");
const TodoController = require("../controllers/todoController");

describe("Todo Controller + Service Tests", () => {
  const mockReq = {
    user: { uuid: "user-123" },
    body: { title: "Test Todo", description: "Test description" },
    params: { id: "1" }
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    getTodosByUser.mockResolvedValue(mockTodos);
    createTodoForUser.mockResolvedValue(mockTodos[0]);
    updateUserTodo.mockResolvedValue(mockTodos[0]);
    deleteUserTodo.mockResolvedValue(true);
  });

  test("GET /todos", async () => {
    await TodoController.getTodos(mockReq, mockRes);

    expect(getTodosByUser).toHaveBeenCalledWith("user-123");
    expect(mockRes.json).toHaveBeenCalledWith({ todos: mockTodos });
  });

  test("POST /todos", async () => {
    await TodoController.createTodo(mockReq, mockRes);

    expect(createTodoForUser).toHaveBeenCalledWith("user-123", mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Todo created successfully",
      todo: mockTodos[0],
    });
  });

  test("PUT /todos/:id", async () => {
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