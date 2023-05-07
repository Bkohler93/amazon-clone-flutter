import * as dotenv from "dotenv";
dotenv.config();

export const PORT: number = 3000;
export const DB_URI = process.env.DB_URI;
