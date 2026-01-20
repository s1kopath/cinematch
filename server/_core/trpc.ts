import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Since authentication is removed, all procedures are now effectively public.
// We keep protectedProcedure as an alias to avoid breaking existing router definitions.
export const protectedProcedure = t.procedure;
export const adminProcedure = t.procedure;
