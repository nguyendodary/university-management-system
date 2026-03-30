import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateAccessToken = (
  payload: object
): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || "default-secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  } as jwt.SignOptions);
};

export const generateRefreshToken = (
  payload: object
): string => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || "default-refresh-secret",
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
    } as jwt.SignOptions
  );
};

export const verifyRefreshToken = (
  token: string
): jwt.JwtPayload => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || "default-refresh-secret"
  ) as jwt.JwtPayload;
};
