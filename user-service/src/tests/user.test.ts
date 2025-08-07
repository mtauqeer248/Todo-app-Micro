import * as UserService from '../services/auth-services';
import {createUser,findUserByEmail} from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../src/models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('UserService - registerUser', () => {
  afterEach(() => jest.clearAllMocks());

  it('should register a user successfully', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    (createUser as jest.Mock).mockResolvedValue(mockUser);

    const result = await UserService.registerUser({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(createUser).toHaveBeenCalled();
    expect(result.email).toBe('test@example.com');
  });

  it('should throw error if user creation fails', async () => {
    (createUser as jest.Mock).mockRejectedValue(new Error('DB Error'));

    await expect(
      UserService.registerUser({
        email: 'test@example.com',
        password: 'password123',
      })
    ).rejects.toThrow('DB Error');
  });
});

describe('UserService - loginUser', () => {
  afterEach(() => jest.clearAllMocks());

  it('should return token and user on successful login', async () => {
    const mockUser = {
      id: 1,
      email: 'login@example.com',
      password_hash: 'hashedpassword',
    };

    (findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('mocked-token');

    const result = await UserService.loginUser({
      email: 'login@example.com',
      password: 'password123',
    });

    expect(findUserByEmail).toHaveBeenCalledWith('login@example.com');
    expect(bcrypt.compare).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalled();
    expect(result.token).toBe('mocked-token');
    expect(result.user.email).toBe('login@example.com');
  });

  it('should throw error for invalid credentials', async () => {
    (findUserByEmail as jest.Mock).mockResolvedValue(null);

    await expect(
      UserService.loginUser({
        email: 'wrong@example.com',
        password: 'password123',
      })
    ).rejects.toThrow('Invalid credentials');
  });

  it('should throw error for wrong password', async () => {
    const mockUser = {
      id: 1,
      email: 'login@example.com',
      password_hash: 'hashedpassword',
    };

    (findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      UserService.loginUser({
        email: 'login@example.com',
        password: 'wrongpass',
      })
    ).rejects.toThrow('Invalid credentials');
  });
});
