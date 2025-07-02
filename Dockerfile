# -------- Stage 1: Build the application --------
FROM node:18-alpine AS builder

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy only pnpm files and package manifests for better caching
COPY pnpm-lock.yaml ./
COPY package.json ./

# Install dependencies (no dev dependencies will be used in the final image)
RUN pnpm install --frozen-lockfile

# Copy the rest of the project
COPY . .

# Build the Next.js app
RUN pnpm build

# -------- Stage 2: Run the application --------
FROM node:18-alpine AS runner

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Create non-root user
RUN addgroup -S app && adduser -S app -G app

# Set working directory
WORKDIR /app

# Copy only needed files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy environment config (optional, only if used)
COPY .env.local .env.local

# Set production environment
ENV NODE_ENV=production

# Use non-root user
USER app

# Expose port
EXPOSE 3000

# Run the Next.js app
CMD ["pnpm", "start"]
