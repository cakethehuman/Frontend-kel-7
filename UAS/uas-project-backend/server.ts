import express, { type Router } from "express";
import cors from "cors";

import menuRoutes from "./routes/menu.routes";
import profileRoutes from "./routes/profile.routes";
import favoritesRoutes from "./routes/favorites.routes";
import feedbackRoutes from "./routes/feedback.routes";
import ordersRoutes from "./routes/orders.routes";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import adminRoutes from "./routes/admin.routes";
import faqRoutes from "./routes/faq.routes";
import contentRoutes from "./routes/content.routes";

const app = express();
app.use(cors());
app.use(express.json());

const daftarRoute: [string, Router][] = [
  ["menu", menuRoutes],
  ["profile", profileRoutes],
  ["favorites", favoritesRoutes],
  ["feedback", feedbackRoutes],
  ["orders", ordersRoutes],
  ["auth", authRoutes],
  ["users", usersRoutes],
  ["admin", adminRoutes],
  ["faqs", faqRoutes],
  ["content", contentRoutes],
];

for (const [nama, router] of daftarRoute) {
  app.use(`/api/${nama}`, router);
  app.use(`/${nama}`, router);
}

const health = (_req: express.Request, res: express.Response) => {
  res.json({ status: "ok", time: new Date().toISOString() });
};
app.get("/api/health", health);
app.get("/health", health);

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}

export default app;
