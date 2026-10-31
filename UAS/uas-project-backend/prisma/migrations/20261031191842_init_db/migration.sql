/*
  Warnings:

  - You are about to drop the `items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `item_id` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `item_id` on the `order_items` table. All the data in the column will be lost.
  - Added the required column `menu_id` to the `cart_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menu_id` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_type` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_method` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "items";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "menus" (
    "menu_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "item_type" TEXT,
    "price" REAL NOT NULL DEFAULT 0,
    "image" TEXT NOT NULL,
    "slug" TEXT
);

-- CreateTable
CREATE TABLE "feedback" (
    "feedback_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "rating" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "region" TEXT,
    "done" BOOLEAN NOT NULL DEFAULT false
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cart_items" (
    "cart_item_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cart_id" INTEGER NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart" ("cart_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cart_items_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus" ("menu_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cart_items" ("cart_id", "cart_item_id", "quantity") SELECT "cart_id", "cart_item_id", "quantity" FROM "cart_items";
DROP TABLE "cart_items";
ALTER TABLE "new_cart_items" RENAME TO "cart_items";
CREATE UNIQUE INDEX "cart_items_cart_id_menu_id_key" ON "cart_items"("cart_id", "menu_id");
CREATE TABLE "new_order_items" (
    "order_item_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_id" INTEGER NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_at_purchase" REAL NOT NULL,
    CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders" ("order_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "order_items_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus" ("menu_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_order_items" ("order_id", "order_item_id", "price_at_purchase", "quantity") SELECT "order_id", "order_item_id", "price_at_purchase", "quantity" FROM "order_items";
DROP TABLE "order_items";
ALTER TABLE "new_order_items" RENAME TO "order_items";
CREATE UNIQUE INDEX "order_items_order_id_menu_id_key" ON "order_items"("order_id", "menu_id");
CREATE TABLE "new_orders" (
    "order_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "total" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tax_rate" REAL NOT NULL DEFAULT 0.1,
    "customer_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "order_type" TEXT NOT NULL,
    "table_number" INTEGER,
    "payment_method" TEXT NOT NULL,
    "note" TEXT,
    CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_orders" ("created_at", "order_id", "status", "total", "user_id") SELECT "created_at", "order_id", "status", "total", "user_id" FROM "orders";
DROP TABLE "orders";
ALTER TABLE "new_orders" RENAME TO "orders";
CREATE TABLE "new_users" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_admin" INTEGER NOT NULL DEFAULT 0,
    "total_balance" REAL NOT NULL DEFAULT 0,
    "role" TEXT NOT NULL DEFAULT 'Student & Programmer',
    "bio" TEXT NOT NULL DEFAULT 'I am an Informatics Engineering student from Belitung, and I currently run tutoring classes in Python programming, piano, basketball, and taekwondo.',
    "tags" TEXT NOT NULL DEFAULT 'AnimLovers,Untarian,Soushin'
);
INSERT INTO "new_users" ("email", "is_admin", "name", "password", "total_balance", "user_id") SELECT "email", "is_admin", "name", "password", "total_balance", "user_id" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "menus_slug_key" ON "menus"("slug");
