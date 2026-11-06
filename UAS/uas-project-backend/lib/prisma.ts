import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

// ensures that the hot reloading didn't occur everytime the page reloades , it checks for old connection for the page
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };


let prisma: PrismaClient;

if (globalForPrisma.prisma) {
  prisma = globalForPrisma.prisma;
} else {
  const pool = new Pool({ connectionString: process.env.database_url });

  const adapter = new PrismaPg(pool);

  prisma = new PrismaClient({ adapter });

  if (process.env.database_url !== 'production') {
    globalForPrisma.prisma = prisma;
  }
}

export { prisma };
