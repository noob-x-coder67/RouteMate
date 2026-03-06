import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/error";

/**
 * Utility to sign JWT Tokens (now includes role)
 */
const signToken = (id: string, universityId: string, role: string): string => {
  const secret = (process.env.JWT_SECRET as string) || "fallback_secret";
  const expiresIn = (process.env.JWT_EXPIRES_IN as any) || "30d";

  return jwt.sign({ id, universityId, role }, secret, { expiresIn });
};

/**
 * REGISTER: Create a new student and link to university
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, name, gender, department } = req.body;

    if (!email || !password || !name) {
      return next(new AppError("Please fill in all required fields", 400));
    }

    const domain = email.split("@")[1];
    const university = await prisma.university.findUnique({
      where: { emailDomain: domain },
    });

    if (!university) {
      return next(
        new AppError(
          "Your university domain is not yet registered on RouteMate.",
          403,
        ),
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(
        new AppError("An account with this email already exists.", 400),
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        gender,
        department,
        universityId: university.id,
        role: "STUDENT",
        co2Saved: 0,
      },
      include: { university: true },
    });

    const token = signToken(newUser.id, university.id, newUser.role);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          university: newUser.university.shortName,
          universityId: newUser.universityId,
          role: newUser.role,
        },
      },
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * LOGIN: Verify student credentials
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { university: true },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    const token = signToken(user.id, user.universityId, user.role);

    res.status(200).json({
      status: "success",
      token,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          university: user.university.shortName,
          universityId: user.universityId,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET ME: Retrieve current session user info
 */
export const getMe = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { university: true },
    });

    if (!user) return next(new AppError("User no longer exists", 404));

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          university: user.university.shortName,
          role: user.role,
          co2Saved: user.co2Saved,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
