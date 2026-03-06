import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createSuperAdmin() {
  const hashedPassword = await bcrypt.hash('Admin@12345', 12); // Use a strong password
  
  // 1. Create a "System" university for the Super Admin
  const systemUni = await prisma.university.upsert({
    where: { emailDomain: 'routemate.com' },
    update: {},
    create: {
      name: 'RouteMate System',
      shortName: 'RM',
      emailDomain: 'routemate.com',
      isActive: true
    }
  });

  // 2. Create the Super Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@routemate.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: Role.SUPER_ADMIN,
      universityId: systemUni.id,
      gender: 'MALE'
    }
  });

  console.log('🚀 Super Admin Created:', admin.email);
}

createSuperAdmin();