const dotenv = require("dotenv");
const result = dotenv.config();
console.log("Dotenv result:", result.error ? result.error : "Loaded");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Set" : "Not Set");
const prisma = require("./src/config/db");

async function main() {
    const user = await prisma.user.findFirst();
    if (user) {
        console.log(`Found user: ${user.mobileNo}`);
    } else {
        console.log("No user found");
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
