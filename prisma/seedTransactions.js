import { PrismaClient, TransactionType } from "@prisma/client";
import { addWeeks, subMonths } from "date-fns";

const prisma = new PrismaClient();

const transactions = [
  // Income Transactions
  {
    categoryId: "cat-1",
    amount: 3000,
    type: "INCOME",
    description: "Monthly salary",
  },
  {
    categoryId: "cat-2",
    amount: 1200,
    type: "INCOME",
    description: "Freelance project payment",
  },
  {
    categoryId: "cat-3",
    amount: 400,
    type: "INCOME",
    description: "Stock market profit",
  },
  {
    categoryId: "cat-10",
    amount: 600,
    type: "INCOME",
    description: "Monthly investment return",
  },
  {
    categoryId: "cat-11",
    amount: 1000,
    type: "INCOME",
    description: "Annual bonus",
  },
  {
    categoryId: "cat-13",
    amount: 500,
    type: "INCOME",
    description: "Savings deposit",
  },
  {
    categoryId: "cat-14",
    amount: 300,
    type: "INCOME",
    description: "Side hustle income",
  },
  {
    categoryId: "cat-15",
    amount: 700,
    type: "INCOME",
    description: "Rental income",
  },
  {
    categoryId: "cat-16",
    amount: 150,
    type: "INCOME",
    description: "Interest earned on bank savings",
  },

  // Expense Transactions
  {
    categoryId: "cat-4",
    amount: 200,
    type: "EXPENSE",
    description: "Weekly grocery shopping",
  },
  {
    categoryId: "cat-5",
    amount: 1500,
    type: "EXPENSE",
    description: "Monthly rent payment",
  },
  {
    categoryId: "cat-6",
    amount: 100,
    type: "EXPENSE",
    description: "Public transport costs",
  },
  {
    categoryId: "cat-7",
    amount: 80,
    type: "EXPENSE",
    description: "Weekend entertainment",
  },
  {
    categoryId: "cat-8",
    amount: 300,
    type: "EXPENSE",
    description: "Clothing and shopping",
  },
  {
    categoryId: "cat-9",
    amount: 150,
    type: "EXPENSE",
    description: "Health and medical expenses",
  },
  {
    categoryId: "cat-12",
    amount: 50,
    type: "EXPENSE",
    description: "Dining out",
  },
  {
    categoryId: "cat-17",
    amount: 200,
    type: "EXPENSE",
    description: "Monthly insurance premium",
  },
  {
    categoryId: "cat-18",
    amount: 100,
    type: "EXPENSE",
    description: "Utility bills",
  },
  {
    categoryId: "cat-19",
    amount: 60,
    type: "EXPENSE",
    description: "Internet and phone bills",
  },
  {
    categoryId: "cat-20",
    amount: 400,
    type: "EXPENSE",
    description: "Education fees",
  },
  {
    categoryId: "cat-21",
    amount: 100,
    type: "EXPENSE",
    description: "Charity donations",
  },
  {
    categoryId: "cat-22",
    amount: 500,
    type: "EXPENSE",
    description: "Travel expenses",
  },
  {
    categoryId: "cat-23",
    amount: 15,
    type: "EXPENSE",
    description: "Streaming subscription",
  },
  {
    categoryId: "cat-24",
    amount: 80,
    type: "EXPENSE",
    description: "Pet care",
  },
];

async function seed() {
  console.log("Seeding database...");

  // Create User
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
    },
  });

  console.log("✅ User created:", user);

  // Seed Transactions (Weekly over 7 months)
  const startDate = subMonths(new Date(), 7);

  for (let i = 0; i < 28; i++) {
    const date = addWeeks(startDate, i);

    for (const transaction of transactions) {
      await prisma.transaction.create({
        data: {
          userId: user.id,
          categoryId: transaction.categoryId,
          amount: transaction.amount,
          type: transaction.type,
          description: transaction.description,
          date,
        },
      });
    }
  }

  console.log("✅ Transactions seeded");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
