FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=optional

COPY . .

RUN npx prisma generate --schema=prisma/schema.prisma

EXPOSE 3001

CMD ["sh", "-c", "npx tsx prisma/seed.ts && npx tsx server.ts"]
