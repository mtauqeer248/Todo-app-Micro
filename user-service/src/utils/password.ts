import bcrypt from "bcryptjs";

export const hash = async (plain: string) => {
  return await bcrypt.hash(plain, 10);
};

export const verify = async (plain: string, hashed: string) => {
  return await bcrypt.compare(plain, hashed);
};
