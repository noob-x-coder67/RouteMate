import prisma from '../config/db';
import bcrypt from 'bcryptjs';

export const registerNewUser = async (userData: any) => {
  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  return await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });
};