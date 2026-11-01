FROM node:22-bookworm-slim

WORKDIR /app

# Copy package definition files
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy application source code
COPY . .

# Environment configuration
ENV NEXT_PUBLIC_API_URL=http://localhost:3001
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Expose frontend port
EXPOSE 3000

# Start Next.js development server binding to 0.0.0.0
CMD ["npx", "next", "dev", "-H", "0.0.0.0"]
