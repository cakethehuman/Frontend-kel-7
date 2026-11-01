FROM node:22-bookworm-slim

# Install system dependencies needed for compiling better-sqlite3 and running sqlite
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package definition files
COPY package*.json ./

# Install npm dependencies
RUN npm install --omit=optional

# Copy application source code
COPY . .

# Generate Prisma client
RUN npx prisma generate --schema=prisma/schema.prisma

# Expose backend port
EXPOSE 3001

# Run database seed and start backend server
CMD ["sh", "-c", "npx tsx prisma/seed.ts && npx tsx server.ts"]
