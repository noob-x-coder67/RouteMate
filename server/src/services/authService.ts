import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db'; // Use the singleton
import { config } from '../config/config';
import { Role, User } from '@prisma/client';

// Simple Error class if AppError is missing
class ServiceError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export const registerUser = async (data: any) => {
  const { email, password, name, universityId, gender, department } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ServiceError(400, 'This email is already registered.');
  }

  const hashedPassword = await bcrypt.hash(password, 12); // Higher salt rounds for security

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      universityId,
      gender,
      department,
      role: Role.STUDENT,
    },
  });

  // Remove password from the object before returning
  const { password: _, ...userWithoutPassword } = user;
  const tokens = generateAuthTokens(user);

  return { user: userWithoutPassword, tokens };
};

export const loginUser = async (email: string, password: string) => {
  // 1. Fetch user AND their university
  const user = await prisma.user.findUnique({
    where: { email },
    include: { university: true }
  });

  // 2. Validate User & Password
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ServiceError(401, 'Invalid email or password');
  }

  // 3. Security: Check if University is Active
  if (!user.university || !user.university.isActive) {
    throw new ServiceError(403, 'Your university access is currently suspended.');
  }

  const { password: _, university, ...userWithoutPassword } = user;
  const tokens = generateAuthTokens(user);

  return { user: userWithoutPassword, tokens };
};

const generateAuthTokens = (user: User) => {
  // 1. Cast the secret to a Secret type
  const secret = config.jwt.secret as jwt.Secret;

  // 2. Explicitly define the options to satisfy the library overloads
  const signOptions: jwt.SignOptions = {
    expiresIn: config.jwt.accessExpiration as any // Use 'any' or cast to string/number
  };

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    secret,
    signOptions
  );

  return {
    access: {
      token: accessToken,
      expires: config.jwt.accessExpiration
    }
  };
};

export const registerStudent = async (data: any) => {
  const { email, password, name, gender } = data;

  // 1. Extract domain from email (e.g., ali@nutech.edu.pk -> nutech.edu.pk)
  const domain = email.split('@')[1];

  // 2. Check if University exists and is active
  const university = await prisma.university.findUnique({
    where: { emailDomain: domain }
  });

  if (!university) {
    throw new Error('Your university is not registered with RouteMate.');
  }

  if (!university.isActive) {
    throw new Error('Service is temporarily suspended for your university.');
  }

  // 3. Password Complexity Check (Regex)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error('Password must be 8+ characters, include uppercase, lowercase, number, and special character.');
  }

  // 4. Hash and Create
  const hashedPassword = await bcrypt.hash(password, 12);

  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      gender,
      universityId: university.id,
      role: Role.STUDENT
    }
  });
};