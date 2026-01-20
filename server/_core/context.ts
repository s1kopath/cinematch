import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

// Guest user used for anonymous access since auth is removed.
const GUEST_USER: User = {
  id: 1,
  openId: "guest",
  name: "Guest User",
  email: "guest@example.com",
  loginMethod: "guest",
  role: "admin", // Allow guest to do everything
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // Always return guest user because authentication has been removed as per user request.
  return {
    req: opts.req,
    res: opts.res,
    user: GUEST_USER,
  };
}
