import type { Config } from "drizzle-kit";
import { env } from "@/env.js";

export default {
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
