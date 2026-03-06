import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking Database Content...');

    const universities = await prisma.university.findMany();
    console.log('Universities:', universities);

    const users = await prisma.user.findMany();
    console.log('Users:', users);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
