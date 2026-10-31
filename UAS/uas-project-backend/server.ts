import express from "express";
import cors from "cors";

import menuRoutes from './routes/menu.routes';

const app = express();
app.use(cors());
app.use(express.json());

app.use("/menu", menuRoutes);

app.listen(3001, () => console.log("API on http://localhost:3001"));
