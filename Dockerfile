# --- STAGE 1: Build Frontend and Bundled Backend Backend ---
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency configs
COPY package*.json ./

# Install standard dependencies
RUN npm ci

# Copy full codebase
COPY . .

# Build Vite static client assets & compile backend typescript server into dist/server.cjs
RUN npm run build

# --- STAGE 2: Lightweight Runtime Environment ---
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy packages config to support start script
COPY package*.json ./

# Install only production dependencies (Express, dotenv, google-genai, etc.)
RUN npm ci --only=production

# Copy compiled assets and bundled server from STAGE 1 builder
COPY --from=builder /app/dist ./dist

# Expose server standard port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
