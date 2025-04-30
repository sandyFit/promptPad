require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    const password = process.env.SEED_PASSWORD;
    const passwordHash = bcrypt.hashSync(password, 10);

    await prisma.user.createMany({
        data: [
            {
                username: "admin",
                email: "admin@example.com",
                passwordHash,
                role: "ADMIN"
            },
            {
                username: "newuser",
                email: "newuser@example.com",
                passwordHash,
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
