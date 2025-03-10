// import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { id: "cat-1", name: "Salary", type: "INCOME" },
    { id: "cat-2", name: "Freelancing", type: "INCOME" },
    { id: "cat-3", name: "Stock Profit", type: "INCOME" },
    { id: "cat-4", name: "Grocery", type: "EXPENSE" },
    { id: "cat-5", name: "Rent", type: "EXPENSE" },
    { id: "cat-6", name: "Transport", type: "EXPENSE" },
    { id: "cat-7", name: "Entertainment", type: "EXPENSE" },
    { id: "cat-8", name: "Shopping", type: "EXPENSE" },
    { id: "cat-9", name: "Health & Medical", type: "EXPENSE" },
    { id: "cat-10", name: "Investments", type: "INCOME" },
    { id: "cat-11", name: "Bonus", type: "INCOME" },
    { id: "cat-12", name: "Foods", type: "EXPENSE" },
    { id: "cat-13", name: "Savings", type: "INCOME" },
    { id: "cat-14", name: "Side Hustle", type: "INCOME" },
    { id: "cat-15", name: "Rental Income", type: "INCOME" },
    { id: "cat-16", name: "Interest Earned", type: "INCOME" },

    { id: "cat-17", name: "Insurance", type: "EXPENSE" },
    { id: "cat-18", name: "Utilities", type: "EXPENSE" },
    { id: "cat-19", name: "Internet & Phone", type: "EXPENSE" },
    { id: "cat-20", name: "Education", type: "EXPENSE" },
    { id: "cat-21", name: "Charity & Donations", type: "EXPENSE" },
    { id: "cat-22", name: "Travel", type: "EXPENSE" },
    { id: "cat-23", name: "Subscriptions", type: "EXPENSE" },
    { id: "cat-24", name: "Pet Expenses", type: "EXPENSE" },
  ];

  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  });

  console.log("Categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
