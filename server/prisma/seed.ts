import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Universities
  const nutech = await prisma.university.upsert({
    where: { emailDomain: "nutech.edu.pk" },
    update: {},
    create: {
      name: "National University of Technology",
      shortName: "NUTECH",
      emailDomain: "nutech.edu.pk",
      isActive: true,
    },
  });
  console.log("Seeded University:", nutech.shortName);

  await prisma.university.upsert({
    where: { emailDomain: "nu.edu.pk" },
    update: {},
    create: {
      name: "FAST-NUCES Islamabad",
      shortName: "FAST",
      emailDomain: "nu.edu.pk",
      isActive: true,
    },
  });

  await prisma.university.upsert({
    where: { emailDomain: "comsats.edu.pk" },
    update: {},
    create: {
      name: "COMSATS University Islamabad",
      shortName: "COMSATS",
      emailDomain: "comsats.edu.pk",
      isActive: true,
    },
  });

  await prisma.university.upsert({
    where: { emailDomain: "nust.edu.pk" },
    update: {},
    create: {
      name: "National University of Sciences & Technology",
      shortName: "NUST",
      emailDomain: "nust.edu.pk",
      isActive: true,
    },
  });

  console.log("Seeded all universities!");

  // 2. Create Super Admin
  const hashedPassword = await bcrypt.hash("Admin@RouteMate2024", 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@routemate.pk" },
    update: {},
    create: {
      email: "admin@routemate.pk",
      password: hashedPassword,
      name: "Platform Admin",
      gender: "MALE",
      role: "SUPER_ADMIN",
      universityId: nutech.id,
      department: "Administration",
    },
  });
  console.log("Seeded Super Admin:", superAdmin.email);
  console.log("Password: Admin@RouteMate2024");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
