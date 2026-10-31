-- CreateTable
CREATE TABLE "users" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_admin" INTEGER NOT NULL DEFAULT 0,
    "total_balance" REAL NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "store" (
    "store_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "store_balance" REAL NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "items" (
    "item_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "item_type" TEXT,
    "price" REAL NOT NULL DEFAULT 0,
    "image" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "cart" (
    "cart_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cart_items" (
    "cart_item_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cart_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart" ("cart_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cart_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items" ("item_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "orders" (
    "order_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "total" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "order_items" (
    "order_item_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_at_purchase" REAL NOT NULL,
    CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders" ("order_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "order_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items" ("item_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cart_user_id_key" ON "cart"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cart_id_item_id_key" ON "cart_items"("cart_id", "item_id");
