
jest.mock("../models/User", () => ({
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
}));

jest.mock("../utils/password", () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

jest.mock("../utils/jwt", () => ({
  generateToken: jest.fn(),
}));


const { createUser, findUserByEmail } = require("../models/User");
const { hash, verify } = require("../utils/password");
const { generateToken } = require("../utils/jwt");
const UserService = require("../services/auth-services");

describe("UserService - Test Suite", () => {
  const mockUser = {
    uuid: "uuid-123",
    email: "test@example.com",
    password: "hashedpassword123",
  };

  const mockPayload = {
    email: "test@example.com",
    password: "password123",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    findUserByEmail.mockResolvedValue(null);

    hash.mockResolvedValue("hashedpassword123");
    generateToken.mockReturnValue("mocked-token");
    verify.mockResolvedValue(true);
    createUser.mockResolvedValue(mockUser);
  });


  describe("registerUser", () => {
    test("should register a user successfully", async () => {
      const result = await UserService.registerUser(mockPayload);

      expect(findUserByEmail).toHaveBeenCalledWith(mockPayload.email);
      expect(hash).toHaveBeenCalledWith(mockPayload.password);
      expect(createUser).toHaveBeenCalledWith({
        email: mockPayload.email,
        password: "hashedpassword123",
      });

    
      expect(result).toEqual({
        uuid: mockUser.uuid,
        email: mockUser.email,
      });
    });

    test("should throw an error if email is already in use", async () => {
     
      findUserByEmail.mockResolvedValue(mockUser);

      await expect(UserService.registerUser(mockPayload)).rejects.toThrow(
        "EMAIL_IN_USE"
      );
    });

    test("should throw an error if user creation fails", async () => {
     
      findUserByEmail.mockResolvedValue(null);
      createUser.mockRejectedValue(new Error("Database error"));

      await expect(UserService.registerUser(mockPayload)).rejects.toThrow(
        "Database error"
      );
    });
  });

 
  describe("loginUser", () => {
    test("should return a token and user on successful login", async () => {
      findUserByEmail.mockResolvedValue(mockUser);
      verify.mockResolvedValue(true);

      const result = await UserService.loginUser(mockPayload);

      expect(findUserByEmail).toHaveBeenCalledWith(mockPayload.email);
      expect(verify).toHaveBeenCalledWith(mockPayload.password, mockUser.password);
      expect(generateToken).toHaveBeenCalledWith({
        uuid: mockUser.uuid,
        email: mockUser.email,
      });
      expect(result).toEqual({
        token: "mocked-token",
        user: {
          uuid: mockUser.uuid,
          email: mockUser.email,
        },
      });
    });

    test("should throw an error for invalid credentials (user not found)", async () => {
      findUserByEmail.mockResolvedValue(null);

      await expect(UserService.loginUser(mockPayload)).rejects.toThrow(
        "INVALID_CREDENTIALS"
      );
    });

    test("should throw an error for invalid credentials (wrong password)", async () => {
      findUserByEmail.mockResolvedValue(mockUser);
      verify.mockResolvedValue(false);

      await expect(UserService.loginUser(mockPayload)).rejects.toThrow(
        "INVALID_CREDENTIALS"
      );
    });
  });
});
