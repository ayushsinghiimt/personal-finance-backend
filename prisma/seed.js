// import { PrismaClient } from "@prisma/client";
// In prisma/seed.js
require('dotenv').config({ path: '../.env' }); // Look up one directory for the .env file
const { PrismaClient } = require("@prisma/client");
const { addWeeks, subMonths } = require("date-fns");
const prisma = new PrismaClient();

console.log(process.env.DATABASE_URL)
console.log("hii")

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

  console.log(" Seeding database...");

  // Create User

  // Seed Transactions (Weekly over 7 months)
  const startDate = subMonths(new Date(), 7);

  // for (let i = 0; i < 28; i++) {
  //   const date = addWeeks(startDate, i);

  //   for (const transaction of transactions) {
  //     await prisma.transaction.create({
  //       data: {
  //         userId: "12345",
  //         categoryId: transaction.categoryId,
  //         amount: transaction.amount,
  //         type: transaction.type,
  //         description: transaction.description,
  //         date,
  //       },
  //     });
  //   }
  // }

  await prisma.assetLiabilityCategory.createMany({
    data: [
      // Assets
      { name: "Bank Account", type: "ASSET" },
      { name: "Investment", type: "ASSET" },
      { name: "Property", type: "ASSET" },
      { name: "Vehicle", type: "ASSET" },
      { name: "Retirement Fund", type: "ASSET" },
      { name: "Stocks", type: "ASSET" },
      { name: "Bonds", type: "ASSET" },
      { name: "Mutual Funds", type: "ASSET" },
      { name: "Cryptocurrency", type: "ASSET" },
      { name: "Precious Metals", type: "ASSET" },
      { name: "Business Ownership", type: "ASSET" },
      { name: "Cash", type: "ASSET" },
      { name: "Intellectual Property", type: "ASSET" },

      // Liabilities
      { name: "Loan", type: "LIABILITY" },
      { name: "Credit Card Debt", type: "LIABILITY" },
      { name: "Mortgage", type: "LIABILITY" },
      { name: "Car Loan", type: "LIABILITY" },
      { name: "Student Loan", type: "LIABILITY" },
      { name: "Medical Debt", type: "LIABILITY" },
      { name: "Personal Loan", type: "LIABILITY" },
      { name: "Payday Loan", type: "LIABILITY" },
      { name: "Business Loan", type: "LIABILITY" },
      { name: "Tax Debt", type: "LIABILITY" },
    ],
  });

  console.log("✅ Transactions seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
