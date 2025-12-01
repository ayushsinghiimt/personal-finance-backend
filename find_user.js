const dotenv = require("dotenv");
const result = dotenv.config();
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
