import { connectDatabase as connectSqlite } from "../sqlite/index.js";

export async function connectDatabase(): Promise<void> {
  await connectSqlite();
}

