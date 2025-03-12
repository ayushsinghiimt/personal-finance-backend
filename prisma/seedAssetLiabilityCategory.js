// import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
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
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
