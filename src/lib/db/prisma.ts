// Correct import — now that you're using the default Prisma client output
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
};

// Prevent multiple instances in dev (Next.js hot reload)
export const prisma = globalForPrisma.prisma ??
  new PrismaClient({
       // In app/src/lib/db/prisma.ts
        log: process.env.NODE_ENV === 'development' 
        ? ['query', 'error', 'warn'] 
        : ['error'],
        });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
