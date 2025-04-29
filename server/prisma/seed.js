const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrytp = require('bcrypt');

async function main() {

    console.log('Seeding database...');
    const password = "2025DEVChallenge";
    const saltRounds = 10;
    const passwordHash = await bcrytp.hash(password, 10);

    await prisma.user.createMany({
        data: [
            {
                username: "admin",
                email: "admin@example.com",
                passwordHash: "hashedPassword",
                role: "ADMIN"
            },
            {
                username: "newuser",
                email: "newuser@example.com",
                passwordHash: "hashedPassword",
                role: "VIEWER"
            }
        ]
    });

    console.log('✅ Users created successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
