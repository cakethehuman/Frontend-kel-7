import express from "express";
import cors from "cors";

import menuRoutes from "./routes/menu.routes";
import profileRoutes from "./routes/profile.routes";
import favoritesRoutes from "./routes/favorites.routes";
import feedbackRoutes from "./routes/feedback.routes";
import ordersRoutes from "./routes/orders.routes";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/menu", menuRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/admin", adminRoutes);

// Global healthcheck route
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}

export default app;
