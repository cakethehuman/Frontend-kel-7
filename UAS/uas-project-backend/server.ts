import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/items", async (_req, res) => {
  res.json(await prisma.item.findMany());
});

app.listen(3001, () => console.log("API on http://localhost:3001"));
