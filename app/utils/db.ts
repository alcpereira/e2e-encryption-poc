import path from "path";
import { readFileSync, writeFileSync } from "node:fs";

const getDBPath = () => {
  return path.resolve(process.cwd(), "database.json");
};

export type DatabaseEntry = {
  /** Simple "unique" index */
  id: number;
  /** Encrypted tweet */
  tweet: string;
};

export function addTweet(encryptedTweet: string): number {
  const db = readFileSync(getDBPath(), "utf-8");
  const data = JSON.parse(db) as unknown as DatabaseEntry[];

  let newId: number;
  if (!data || data.length === 0) {
    newId = 1;
  } else {
    newId = data[data.length - 1].id + 1;
  }

  const newEntry: DatabaseEntry = { id: newId, tweet: String(encryptedTweet) };

  writeFileSync(getDBPath(), JSON.stringify([...data, newEntry], null, 2));

  return newId;
}

export function readTweet(id: number): DatabaseEntry | undefined {
  const db = readFileSync(getDBPath(), "utf-8");
  const data = JSON.parse(db) as unknown as DatabaseEntry[];

  return data.find((entry) => entry.id === id);
}
