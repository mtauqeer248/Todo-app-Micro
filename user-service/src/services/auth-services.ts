import { createUser, findUserByEmail } from "../models/User";
import { hash, verify } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { CreateUserRequest, LoginRequest } from "../types/user.types";

export const registerUser = async ({ email, password }: CreateUserRequest) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("EMAIL_IN_USE");
  }

  const hashed = await hash(password);
  const user = await createUser({
      email,
      password: hashed,
  });

  const { password: _, ...userResponse } = user;
  return userResponse;
};

export const loginUser = async ({ email, password }: LoginRequest) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isValid = await verify(password, user.password); // compare with hashed
  if (!isValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = generateToken({
    uuid: user.uuid,
    email: user.email,
  });

  return {
    token,
    user: {
      uuid: user.uuid,
      email: user.email,
    },
  };
};
