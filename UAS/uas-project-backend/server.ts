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

<<<<<<< HEAD

app.use("/api/menu", menuRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/content", contentRoutes);
=======
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
>>>>>>> 0141239416f78488e8ef1060df0d0ee2ffac920d

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