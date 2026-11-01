import express from "express";
import cors from "cors";

import menuRoutes from "./routes/menu.routes";
import profileRoutes from "./routes/profile.routes";
import favoritesRoutes from "./routes/favorites.routes";
import feedbackRoutes from "./routes/feedback.routes";
import ordersRoutes from "./routes/orders.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/menu", menuRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/orders", ordersRoutes);

app.listen(3001, () => console.log("API on http://localhost:3001"));
