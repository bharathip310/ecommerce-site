import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const url = process.env.DATABASE_URL;

let config;

if (url) {
  config = defineConfig({
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    dialect: "postgresql",
    schemaFilter: ["public"],
    dbCredentials: {
      url: url,
    },
    verbose: true,
  });
} else {
  const sqlHost = process.env.SQL_HOST;
  const sqlDbName = process.env.SQL_DB_NAME;
  const user = process.env.SQL_ADMIN_USER;
  const password = process.env.SQL_ADMIN_PASSWORD;

  if (!sqlHost) {
    throw new Error("SQL_HOST or DATABASE_URL must be set in environment variables.");
  }
  if (!sqlDbName) throw new Error("SQL_DB_NAME must be set");
  if (!user) throw new Error("SQL_ADMIN_USER must be set");
  if (!password) throw new Error("SQL_ADMIN_PASSWORD must be set");

  config = defineConfig({
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    dialect: "postgresql",
    schemaFilter: ["public"],
    dbCredentials: {
      host: sqlHost,
      user: user,
      password: password,
      database: sqlDbName,
      ssl: false,
    },
    verbose: true,
  });
}

export default config;
